// services/noteService.ts
import { auth, db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where, orderBy, updateDoc, startAt, endAt } from "firebase/firestore";


const notesRef = collection(db, "notes");

export const searchNotes = async (keyword: string) => {
  if (!auth.currentUser) throw new Error("Not logged in");

  // Search by title (prefix match)
  const q = query(
    notesRef,
    where("userId", "==", auth.currentUser?.uid),
    orderBy("title"),
    startAt(keyword),
    endAt(keyword + "\uf8ff")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addNote = async (title: string, content: string) => {
  if (!auth.currentUser) throw new Error("Not logged in");
  return addDoc(notesRef, {
    title,
    content,
    userId: auth.currentUser?.uid,
    createdAt: new Date(),
  });
};

export const getNotes = async () => {
  if (!auth.currentUser) throw new Error("Not logged in");
  const q = query(notesRef, where("userId", "==", auth.currentUser?.uid), orderBy("createdAt", "desc"));
  return getDocs(q);
};

export const updateNote = async (id: string, title: string, content: string) => {
  const noteRef = doc(db, "notes", id);
  return updateDoc(noteRef, { title, content, userId: auth.currentUser?.uid });
};

export const deleteNote = async (id: string) => {
  const noteRef = doc(db, "notes", id);
  return deleteDoc(noteRef);
};
