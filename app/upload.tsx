import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXERCISE_TYPES = [
  { id: "squat", label: "深蹲", emoji: "🏋️" },
  { id: "bench-press", label: "卧推", emoji: "💪" },
  { id: "deadlift", label: "硬拉", emoji: "🏋️" },
  { id: "pushup", label: "俯卧撑", emoji: "💯" },
  { id: "pullup", label: "引体向上", emoji: "🤸" },
  { id: "running", label: "跑步", emoji: "🏃" },
];

export default function UploadScreen() {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickVideo = async () => {
    // Simulate video selection
    setSelectedVideo("mock-video-uri");
    Alert.alert("提示", "已选择视频");
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert("提示", "请先选择视频");
      return;
    }

    if (!selectedExercise) {
      Alert.alert("提示", "请先选择训练动作");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload and analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create analysis record
      const recordId = Date.now().toString();
      const newRecord = {
        id: recordId,
        exerciseType: EXERCISE_TYPES.find((e) => e.id === selectedExercise)?.label,
        score: Math.floor(Math.random() * 40 + 60),
        date: new Date().toISOString(),
        videoUri: selectedVideo,
        analysis: {
          issues: [
            { severity: "high", description: "膝盖内扣，需要调整站距" },
            { severity: "medium", description: "腰椎弯曲幅度过大" },
          ],
          suggestions: [
            "增加脚距宽度，确保膝盖与脚尖对齐",
            "核心肌群收紧，保持腰椎中立位置",
          ],
        },
      };

      // Save to AsyncStorage
      const stored = await AsyncStorage.getItem("analysisRecords");
      const records = stored ? JSON.parse(stored) : [];
      records.unshift(newRecord);
      await AsyncStorage.setItem("analysisRecords", JSON.stringify(records));

      // Navigate to result page
      router.push({
        pathname: "/(tabs)/detail",
        params: { recordId },
      } as any);
    } catch (error) {
      Alert.alert("错误", "上传失败，请重试");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const exerciseType = EXERCISE_TYPES.find((e) => e.id === selectedExercise);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.push("/(tabs)" as any)}>
              <Text className="text-lg text-primary font-semibold">← 返回</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground mt-2">上传视频</Text>
            <Text className="text-base text-muted">选择您的训练视频进行分析</Text>
          </View>

          {/* Video Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">1. 选择视频</Text>
            <TouchableOpacity
              onPress={handlePickVideo}
              className={`border-2 border-dashed rounded-2xl p-8 items-center justify-center gap-3 ${
                selectedVideo ? 'border-success bg-success bg-opacity-10' : 'border-border'
              }`}
            >
              <Text className="text-4xl">{selectedVideo ? "✅" : "📹"}</Text>
              <Text className="text-base font-semibold text-foreground text-center">
                {selectedVideo ? "视频已选择" : "点击选择视频"}
              </Text>
              <Text className="text-sm text-muted text-center">
                支持 MP4、MOV 等格式，时长不超过 1 分钟
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Type Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">2. 选择训练动作</Text>
            <View className="flex-row flex-wrap gap-2">
              {EXERCISE_TYPES.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() => setSelectedExercise(exercise.id)}
                  className={`flex-1 min-w-[30%] rounded-xl p-4 items-center gap-2 ${
                    selectedExercise === exercise.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text className="text-2xl">{exercise.emoji}</Text>
                  <Text
                    className={`text-sm font-semibold text-center ${
                      selectedExercise === exercise.id
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {exercise.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Upload Button */}
          <View className="gap-2">
            <TouchableOpacity
              onPress={handleUpload}
              disabled={isUploading || !selectedVideo || !selectedExercise}
              className={`rounded-2xl p-4 items-center justify-center ${
                isUploading || !selectedVideo || !selectedExercise
                  ? "bg-border opacity-50"
                  : "bg-primary"
              }`}
            >
              <Text className="text-lg font-semibold text-background">
                {isUploading ? "分析中..." : "开始分析"}
              </Text>
            </TouchableOpacity>

            {isUploading && (
              <View className="items-center gap-2">
                <View className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <Text className="text-sm text-muted">正在分析您的视频...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
