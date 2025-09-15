import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { login } from "@/services/authService"

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPasword] = useState<string>("")
  const [isLodingReg, setIsLoadingReg] = useState<boolean>(false)

  const handleLogin = async () => {
    
    if (isLodingReg) return
    setIsLoadingReg(true)
    await login(email, password)
      .then((res) => {
        console.log(res)
        router.push("/home")
      })
      .catch((err) => {
        console.error(err)
        Alert.alert("Login failed", "Somthing went wrong")
      })
      .finally(() => {
        setIsLoadingReg(false)
      })
  }

  return (
  <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 justify-center p-6">
    <View className="bg-white rounded-2xl shadow-xl p-6">
      <Text className="text-3xl font-extrabold mb-6 text-blue-600 text-center">
        Welcome Back 👋
      </Text>

      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-1">Email</Text>
        <TextInput
          placeholder="Enter your email"
          className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-1">Password</Text>
        <TextInput
          placeholder="Enter your password"
          className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPasword}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-xl mt-2 shadow-md"
        onPress={handleLogin}
      >
        {isLodingReg ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text className="text-center text-xl font-semibold text-white">
            Login
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="px-3 text-gray-500">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity className="bg-white p-3 rounded-full shadow">
          <Text className="text-lg">🧾</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-3 rounded-full shadow">
          <Text className="text-lg">🖊️</Text>
        </TouchableOpacity>
      </View>

      
      <Pressable onPress={() => router.push("/register")} className="mt-6">
        <Text className="text-center text-blue-600 text-base font-medium">
          Don’t have an account? <Text className="font-bold">Register</Text>
        </Text>
      </Pressable>
    </View>
  </View>
);

}

export default Login
