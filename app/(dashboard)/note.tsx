// app/note.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  searchNotes,
} from "@/services/noteService";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function NoteScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);


  
  // 🔍 run search when query changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch(query.trim());
      } else {
        loadNotes();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // search Firestore by title
  async function handleSearch(keyword: string) {
    try {
      setLoading(true);
      const results = await searchNotes(keyword);
      setNotes(results);
    } catch (e) {
      console.log("Error searching notes:", e);
    } finally {
      setLoading(false);
    }
  }

  // load all notes
  const loadNotes = async () => {
    try {
      setLoading(true);
      const snap = await getNotes();
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotes(data);
    } catch (e) {
      console.log("Error loading notes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // save or update note
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
    } catch (e) {
      console.log("Save error:", e);
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
      {
        text: "Delete",
        onPress: async () => {
          await deleteNote(id);
          loadNotes();
        },
      },
    ]);
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
          className={`p-4 rounded-xl ${
            editId ? "bg-yellow-500" : "bg-blue-600"
          }`}
          onPress={handleSave}
        >
          <Text className="text-white text-center font-bold">
            {editId ? "Update Note" : "Save Note"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mb-4 flex-row items-center bg-white rounded-2xl p-2 shadow">
        <Feather name="search" size={18} color="#374151" />
        <TextInput
          placeholder="Search by title..."
          className="ml-3 flex-1 text-slate-800"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Feather name="x" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Notes List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-2 text-gray-500">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-2xl mb-4 shadow">
              <Text className="font-bold text-lg text-gray-800 mb-1">
                {item.title}
              </Text>
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
                  <Text className="ml-1 text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
