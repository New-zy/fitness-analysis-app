import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnalysisResult {
  issues: Array<{ severity: string; description: string }>;
  suggestions: string[];
}

interface AnalysisRecord {
  id: string;
  exerciseType: string;
  score: number;
  date: string;
  analysis: AnalysisResult;
}

const exerciseTypes = [
  { name: "深蹲", emoji: "🏋️" },
  { name: "卧推", emoji: "💪" },
  { name: "硬拉", emoji: "🏋️" },
  { name: "俯卧撑", emoji: "💯" },
  { name: "引体向上", emoji: "🤸" },
  { name: "跑步", emoji: "🏃" },
];

const mockAnalysisResults: Record<string, AnalysisResult> = {
  深蹲: {
    issues: [
      { severity: "high", description: "膝盖内扣，容易造成膝关节损伤" },
      { severity: "medium", description: "下蹲深度不足，没有达到标准深蹲范围" },
    ],
    suggestions: [
      "保持膝盖与脚尖方向一致，避免内扣",
      "增加下蹲深度，至少达到大腿与地面平行",
      "加强核心力量训练，提高身体稳定性",
    ],
  },
  卧推: {
    issues: [
      { severity: "medium", description: "杠铃轨迹偏离，不够垂直" },
      { severity: "low", description: "肘部角度可以优化" },
    ],
    suggestions: [
      "专注于杠铃的垂直轨迹，避免前后摇晃",
      "调整肘部角度至 45 度，提高效率",
      "加强肩部稳定性训练",
    ],
  },
  硬拉: {
    issues: [
      { severity: "high", description: "背部过度弯曲，容易导致腰椎受伤" },
    ],
    suggestions: [
      "保持背部挺直，核心收紧",
      "提高臀部位置，减少腰椎压力",
      "加强背部和臀部力量",
    ],
  },
  俯卧撑: {
    issues: [
      { severity: "low", description: "身体位置略微下沉" },
    ],
    suggestions: [
      "保持身体从头到脚跟的一条直线",
      "增加核心力量训练",
    ],
  },
  引体向上: {
    issues: [
      { severity: "medium", description: "拉升高度不足，没有充分利用背部肌肉" },
    ],
    suggestions: [
      "增加拉升高度，至少达到下巴超过杠杆",
      "加强背部肌肉训练",
    ],
  },
  跑步: {
    issues: [
      { severity: "low", description: "步幅可以进一步优化" },
    ],
    suggestions: [
      "增加步频，减少单步距离",
      "改善着地姿态，减少冲击力",
    ],
  },
};

export default function UploadScreen() {
  const router = useRouter();
  const [videoSelected, setVideoSelected] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const handleSelectVideo = () => {
    setVideoSelected(true);
  };

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
  };

  const handleStartAnalysis = async () => {
    if (!videoSelected || !selectedExercise) {
      Alert.alert("提示", "请先选择视频和训练动作");
      return;
    }

    try {
      // Generate mock analysis result
      const newRecord: AnalysisRecord = {
        id: String(Date.now()),
        exerciseType: selectedExercise,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        date: new Date().toISOString(),
        analysis: mockAnalysisResults[selectedExercise] || {
          issues: [],
          suggestions: [],
        },
      };

      // Save to AsyncStorage
      const stored = await AsyncStorage.getItem("analysisRecords");
      const records = stored ? JSON.parse(stored) : [];
      records.push(newRecord);
      await AsyncStorage.setItem("analysisRecords", JSON.stringify(records));

      // Reset form
      setVideoSelected(false);
      setSelectedExercise(null);

      // Navigate to detail page
      router.push({
        pathname: "/detail",
        params: { recordId: newRecord.id },
      } as any);
    } catch (error) {
      Alert.alert("错误", "分析失败，请重试");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">上传视频</Text>
            <Text className="text-base text-muted">选择您的训练视频进行分析</Text>
          </View>

          {/* Video Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">1. 选择视频</Text>
            <TouchableOpacity
              onPress={handleSelectVideo}
              className={`rounded-2xl p-8 items-center justify-center gap-3 border-2 border-dashed ${
                videoSelected ? "bg-success bg-opacity-10 border-success" : "bg-surface border-border"
              }`}
            >
              {videoSelected ? (
                <>
                  <Text className="text-4xl">✅</Text>
                  <Text className="text-lg font-semibold text-foreground">视频已选择</Text>
                </>
              ) : (
                <>
                  <Text className="text-4xl">📹</Text>
                  <Text className="text-lg font-semibold text-foreground">点击选择视频</Text>
                </>
              )}
              <Text className="text-sm text-muted text-center">
                支持 MP4、MOV 等格式，时长不超过 1 分钟
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">2. 选择训练动作</Text>
            <View className="flex-row flex-wrap gap-3">
              {exerciseTypes.map((exercise) => (
                <TouchableOpacity
                  key={exercise.name}
                  onPress={() => handleSelectExercise(exercise.name)}
                  className={`flex-1 min-w-[30%] rounded-2xl p-4 items-center justify-center gap-2 border-2 ${
                    selectedExercise === exercise.name
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-3xl">{exercise.emoji}</Text>
                  <Text
                    className={`text-sm font-semibold text-center ${
                      selectedExercise === exercise.name ? "text-background" : "text-foreground"
                    }`}
                  >
                    {exercise.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Analysis Button */}
          <TouchableOpacity
            onPress={handleStartAnalysis}
            disabled={!videoSelected || !selectedExercise}
            className={`rounded-2xl p-4 items-center justify-center ${
              videoSelected && selectedExercise ? "bg-primary" : "bg-muted opacity-50"
            }`}
          >
            <Text className="text-lg font-semibold text-background">开始分析</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
