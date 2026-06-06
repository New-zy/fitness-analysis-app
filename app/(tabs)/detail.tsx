import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
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

export default function DetailScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecord();
  }, [recordId]);

  const loadRecord = async () => {
    try {
      const stored = await AsyncStorage.getItem("analysisRecords");
      if (stored) {
        const records = JSON.parse(stored) as AnalysisRecord[];
        const found = records.find((r) => r.id === String(recordId));
        setRecord(found || null);
      }
    } catch (error) {
      console.error("Failed to load record:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-error";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-error";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "严重";
      case "medium":
        return "中等";
      case "low":
        return "轻微";
      default:
        return "未知";
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">加载中...</Text>
      </ScreenContainer>
    );
  }

  if (!record) {
    return (
      <ScreenContainer className="items-center justify-center gap-4">
        <Text className="text-4xl">❌</Text>
        <Text className="text-lg font-semibold text-foreground">记录未找到</Text>
        <TouchableOpacity
          onPress={() => router.push("/history")}
          className="bg-primary rounded-lg px-6 py-3 mt-4"
        >
          <Text className="text-background font-semibold">返回</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.push("/history")}>
              <Text className="text-lg text-primary font-semibold">← 返回</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground mt-2">分析结果</Text>
            <Text className="text-base text-muted">
              {new Date(record.date).toLocaleDateString("zh-CN")}
            </Text>
          </View>

          {/* Score Card */}
          <View
            className={`rounded-3xl p-8 items-center justify-center gap-3 ${getScoreColor(
              record.score
            )}`}
          >
            <Text className="text-6xl font-bold text-white">{record.score}</Text>
            <Text className="text-xl text-white font-semibold">{record.exerciseType}</Text>
            <Text className="text-sm text-white opacity-90">
              {record.score >= 80
                ? "优秀"
                : record.score >= 60
                  ? "良好"
                  : "需要改进"}
            </Text>
          </View>

          {/* Issues Section */}
          {record.analysis.issues && record.analysis.issues.length > 0 && (
            <View className="gap-3">
              <Text className="text-xl font-semibold text-foreground">检测到的问题</Text>
              {record.analysis.issues.map((issue, index) => (
                <View
                  key={index}
                  className="bg-surface border border-border rounded-xl p-4 flex-row gap-3 items-start"
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${getSeverityColor(
                      issue.severity
                    )}`}
                  >
                    <Text className="text-xs font-bold text-white">!</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-muted">
                      {getSeverityLabel(issue.severity)}问题
                    </Text>
                    <Text className="text-base text-foreground mt-1">
                      {issue.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Suggestions Section */}
          {record.analysis.suggestions && record.analysis.suggestions.length > 0 && (
            <View className="gap-3">
              <Text className="text-xl font-semibold text-foreground">改进建议</Text>
              {record.analysis.suggestions.map((suggestion, index) => (
                <View
                  key={index}
                  className="bg-success bg-opacity-10 border border-success rounded-xl p-4 flex-row gap-3 items-start"
                >
                  <Text className="text-2xl">💡</Text>
                  <Text className="flex-1 text-base text-foreground leading-relaxed">
                    {suggestion}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={() => router.push("/upload")}
              className="bg-primary rounded-2xl p-4 items-center justify-center"
            >
              <Text className="text-lg font-semibold text-background">📹 重新分析</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/history")}
              className="bg-surface border border-border rounded-2xl p-4 items-center justify-center"
            >
              <Text className="text-lg font-semibold text-foreground">📋 查看历史</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
