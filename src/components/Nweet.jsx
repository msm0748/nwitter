import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc, getFirestore } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
// import { storageService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      //글 삭제
      await deleteDoc(NweetTextRef);
      //이미지 삭제
      await deleteDoc(doc(getFirestore(), `nweets/${nweetObj.id}`));
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    //글 수정
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
    console.log(nweetObj, newNweet);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your nweet" value={newNweet} onChange={onChange} required />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>cancle</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px;" height="50px;" alt="" />}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
