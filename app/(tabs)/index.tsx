import { ScrollView, Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnalysisRecord {
  id: string;
  exerciseType: string;
  score: number;
  date: string;
  thumbnail?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [recentRecords, setRecentRecords] = useState<AnalysisRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadRecentRecords();
    }, [router])
  );

  const loadRecentRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem("analysisRecords");
      if (stored) {
        const records = JSON.parse(stored) as AnalysisRecord[];
        setRecentRecords(records.slice(0, 3));
      } else {
        setRecentRecords([]);
      }
    } catch (error) {
      console.error("Failed to load records:", error);
    }
  };

  const handleUploadVideo = () => {
    router.push("/upload" as any);
  };

  const handleViewHistory = () => {
    router.push("/history" as any);
  };

  const handleRecordPress = (record: AnalysisRecord) => {
    router.push({
      pathname: "/detail" as any,
      params: { recordId: record.id },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header Section */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">FitCorrect AI</Text>
            <Text className="text-base text-muted">
              完美的动作，从纠正开始
            </Text>
          </View>

          {/* Quick Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleUploadVideo}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-lg font-semibold text-background text-center">
                📹 上传视频分析
              </Text>
              <Text className="text-sm text-background text-center opacity-90 mt-1">
                上传您的训练视频，获取AI动作纠正
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewHistory}
              className="bg-surface border border-border rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-lg font-semibold text-foreground text-center">
                📋 查看历史记录
              </Text>
              <Text className="text-sm text-muted text-center mt-1">
                查看所有分析结果和改进进度
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Analysis Section */}
          {recentRecords.length > 0 && (
            <View className="gap-3">
              <Text className="text-xl font-semibold text-foreground">最近分析</Text>
              <FlatList
                data={recentRecords}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleRecordPress(item)}
                    className="bg-surface border border-border rounded-xl p-4 mb-3 active:opacity-70 flex-row items-center gap-4"
                  >
                    {/* Thumbnail Placeholder */}
                    <View className="w-16 h-16 bg-primary rounded-lg items-center justify-center">
                      <Text className="text-2xl">🏋️</Text>
                    </View>

                    {/* Record Info */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.exerciseType}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {new Date(item.date).toLocaleDateString("zh-CN")}
                      </Text>
                    </View>

                    {/* Score Badge */}
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center ${
                        item.score >= 80
                          ? "bg-success"
                          : item.score >= 60
                            ? "bg-warning"
                            : "bg-error"
                      }`}
                    >
                      <Text className="text-white font-bold text-lg">
                        {item.score}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Empty State */}
          {recentRecords.length === 0 && (
            <View className="bg-surface rounded-2xl p-8 items-center gap-3 border border-border">
              <Text className="text-4xl">🎯</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                开始您的第一次分析
              </Text>
              <Text className="text-sm text-muted text-center">
                上传您的训练视频，获取专业的动作纠正反馈
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
