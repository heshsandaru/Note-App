import { register } from "@/services/authService"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPasword] = useState<string>("")
  const [isLodingReg, setIsLoadingReg] = useState<boolean>(false)

  const handleRegister = async () => {
    // if(!email){

    // }
    // 
    if (isLodingReg) return
    setIsLoadingReg(true)
    await register(email, password)
      .then((res) => {
        console.log(res)
        router.back()
      })
      .catch((err) => {
        console.error(err)
        Alert.alert("Registration fail", "Somthing went wrong")
        // import { Alert } from "react-native"
      })
      .finally(() => {
        setIsLoadingReg(false)
      })
  }

  return (
  <View className="flex-1 bg-gradient-to-b from-green-50 to-green-100 justify-center p-6">
    <View className="bg-white rounded-2xl shadow-xl p-6">
      <Text className="text-3xl font-extrabold mb-6 text-green-600 text-center">
        Create Account ✨
      </Text>

      {/* Email Input */}
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

      {/* Password Input */}
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

      {/* Register Button */}
      <TouchableOpacity
        className="bg-green-600 p-4 rounded-xl mt-2 shadow-md"
        onPress={handleRegister}
      >
        {isLodingReg ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text className="text-center text-xl font-semibold text-white">
            Register
          </Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="px-3 text-gray-500">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      {/* Social Sign-up Buttons */}
      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity className="bg-white p-3 rounded-full shadow">
          <Text className="text-lg">🧑‍💻</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-3 rounded-full shadow">
          <Text className="text-lg">📖</Text>
        </TouchableOpacity>
      </View>

      {/* Back to Login */}
      <Pressable onPress={() => router.back()} className="mt-6">
        <Text className="text-center text-green-600 text-base font-medium">
          Already have an account? <Text className="font-bold">Login</Text>
        </Text>
      </Pressable>
    </View>
  </View>
);

}

export default Register
