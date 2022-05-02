import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fBase";
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    //onSnapshot 실시간 데이터 가져오기
    const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    // fireBase-storge에 이미지 넣기
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      createdId: userObj.uid,
      attachmentUrl,
    };

    if (nweet === "") {
      return;
    }
    // 데이터 추가
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setNweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="what's on your mind?" maxLength={120} value={nweet} onChange={onChange} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && <img src={attachment} width="50px" height="50px" alt="" />}
        <button onClick={onClearAttachment}>Clear</button>
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.createdId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};
export default Home;
