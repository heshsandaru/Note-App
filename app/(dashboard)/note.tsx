// app/note.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { addNote, getNotes, updateNote, deleteNote, searchNotes } from "@/services/noteService";
import { Ionicons } from "@expo/vector-icons"; // 👈 for icons

export default function NoteScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadNotes = async () => {
    const snap = await getNotes();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async () => {
    if (!title) return Alert.alert("Title required");
    try {
      if (editId) {
        await updateNote(editId, title, content);
        setEditId(null);
      } else {
        await addNote(title, content);
      }
      setTitle("");
      setContent("");
      await loadNotes();
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleEdit = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: async () => { await deleteNote(id); loadNotes(); } },
    ]);
  };

  const handleSearch = async () => {
    if (!search) {
      await loadNotes();
      return;
    }
    const results = await searchNotes(search);
    setNotes(results);
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      {/* Form */}
      <View className="bg-white p-5 rounded-2xl shadow mb-5">
        <Text className="text-xl font-bold mb-3 text-gray-800">
          {editId ? "✏️ Edit Note" : "📝 Add Note"}
        </Text>
        <TextInput
          placeholder="Enter title..."
          value={title}
          onChangeText={setTitle}
          className="border border-gray-300 p-3 mb-3 rounded-xl bg-gray-50"
        />
        <TextInput
          placeholder="Enter content..."
          value={content}
          onChangeText={setContent}
          multiline
          className="border border-gray-300 p-3 mb-3 rounded-xl bg-gray-50 h-24"
        />
        <TouchableOpacity
          className={`p-4 rounded-xl ${editId ? "bg-yellow-500" : "bg-blue-600"}`}
          onPress={handleSave}
        >
          <Text className="text-white text-center font-bold">
            {editId ? "Update Note" : "Save Note"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-white rounded-2xl shadow px-3 mb-5">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
          className="flex-1 p-3"
        />
        <TouchableOpacity onPress={handleSearch} className="p-2">
          <Ionicons name="arrow-forward-circle" size={28} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
  data={notes}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View className="bg-white p-4 rounded-2xl mb-4 shadow">
      <Text className="font-bold text-lg text-gray-800 mb-1">{item.title}</Text>
      <Text className="text-gray-600 mb-3">{item.content}</Text>

      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          className="flex-row items-center bg-yellow-400 px-3 py-2 rounded-xl"
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color="black" />
          <Text className="ml-1">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-red-500 px-3 py-2 rounded-xl"
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="white" />
          <Text className="ml-1 items-center text-white"></Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
/>

    </View>
  );
}
