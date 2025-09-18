import { deleteNote, getNotes } from "@/services/noteService";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Note = {
  id: string;
  title: string;
  body: string;
  pinned?: boolean;
  color?: string;
  updatedAt?: string;
};

export default function NoteAppHome() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);


  

  async function handleSaveNote() {
    if (!newTitle.trim() && !newBody.trim()) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const note: Note = {
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled",
      body: newBody.trim(),
      pinned: false,
      color: sampleColors[Math.floor(Math.random() * sampleColors.length)],
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [note, ...prev]); // <-- add to local state

    setNewBody("");
    setNewTitle("");
    setModalVisible(false);
    setIsSaving(false);
  }

  function renderNoteCard({ item }: { item: Note }) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: item.color || "#ffffff" }}
        onPress={() => {
          alert(item.title);
        }}
      >
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-gray-900">
            {item.title}
          </Text>
        </View>
        <Text numberOfLines={3} className="text-sm text-gray-800 mt-2">
          {item.body}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-6">
        <Text className="text-3xl font-extrabold text-slate-800">My Notes</Text>
        <Text className="text-sm text-slate-500 mt-1">
          Quickly capture ideas, to-dos and reminders.
        </Text>

        {/* Search */}
        <View className="mt-4 flex-row items-center bg-white rounded-2xl p-2 shadow">
          <Feather name="search" size={18} color="#374151" />
          <TextInput
            placeholder="Search notes, titles or content"
            className="ml-3 flex-1 text-slate-800"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity
            onPress={() => {
              setQuery("");
            }}
          >
            <Feather name="x" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View className="mt-4 flex-row justify-between items-center">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="bg-white px-3 py-2 rounded-2xl shadow flex-row items-center">
              <Feather name="plus" size={16} color="#10b981" />
              <Text className="ml-2 text-sm text-slate-700">New</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white px-3 py-2 rounded-2xl shadow flex-row items-center">
              <Feather name="filter" size={16} color="#06b6d4" />
              <Text className="ml-2 text-sm text-slate-700">Filter</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-white px-3 py-2 rounded-2xl shadow flex-row items-center"
            onPress={() => router.push("/(dashboard)/note")}
          >
            <MaterialIcons name="note-add" size={16} color="#06b6d4" />
            <Text className="ml-2 text-sm text-slate-700">Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="px-6 mt-4 flex-1">
        <View className="flex-1 mt-4">
          {notes.length === 0 ? (
            // Empty state
            <View className="flex-1 items-center justify-center">
              <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
              <Text className="mt-4 text-lg font-medium text-gray-600">
                No notes yet
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Start by creating a new note
              </Text>
            </View>
          ) : (
            // Notes list
            <FlatList
              data={notes.filter(
                (n) =>
                  n.title.toLowerCase().includes(query.toLowerCase()) ||
                  n.body.toLowerCase().includes(query.toLowerCase())
              )}
              renderItem={renderNoteCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>
      </View>

      {/* Floating Action Button */}
      <View className="absolute right-6 bottom-8">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
          activeOpacity={0.9}
        >
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add Note Modal */}
      <Modal animationType="slide" visible={modalVisible} transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View
            className="bg-white rounded-t-3xl p-6 shadow-xl"
            style={{ minHeight: 320 }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold">New Note</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="#6b7280" />
              </Pressable>
            </View>

            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              className="mt-4 bg-slate-50 px-4 py-3 rounded-xl text-slate-800"
            />

            <TextInput
              placeholder="Write something..."
              value={newBody}
              onChangeText={setNewBody}
              multiline
              numberOfLines={6}
              className="mt-4 bg-slate-50 px-4 py-3 rounded-xl text-slate-800 h-36"
              textAlignVertical="top"
            />

            <View className="mt-4 flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                <Text className="text-sm text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-blue-600"
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-sm text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// -------------------- helpers & sample data --------------------
const sampleColors = ["#fff7ed", "#ecfeff", "#eef2ff", "#ecfccb", "#fff1f2"];
