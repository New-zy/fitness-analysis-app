import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnalysisRecord {
  id: string;
  exerciseType: string;
  score: number;
  date: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AnalysisRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const loadRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem("analysisRecords");
      if (stored) {
        const allRecords = JSON.parse(stored) as AnalysisRecord[];
        setRecords(allRecords);
        setFilteredRecords(allRecords);
      }
    } catch (error) {
      console.error("Failed to load records:", error);
    }
  };

  const handleFilterChange = (exerciseType: string | null) => {
    setSelectedFilter(exerciseType);
    if (exerciseType) {
      setFilteredRecords(records.filter((r) => r.exerciseType === exerciseType));
    } else {
      setFilteredRecords(records);
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    Alert.alert("删除记录", "确定要删除这条分析记录吗？", [
      { text: "取消", onPress: () => {} },
      {
        text: "删除",
        onPress: async () => {
          try {
            const updated = records.filter((r) => r.id !== recordId);
            await AsyncStorage.setItem("analysisRecords", JSON.stringify(updated));
            setRecords(updated);
            handleFilterChange(selectedFilter);
          } catch (error) {
            Alert.alert("错误", "删除失败，请重试");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleRecordPress = (record: AnalysisRecord) => {
    router.push({
      pathname: "/detail",
      params: { recordId: record.id },
    } as any);
  };

  const exerciseTypes = Array.from(new Set(records.map((r) => r.exerciseType)));

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="text-lg text-primary font-semibold">← 返回</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground mt-2">历史记录</Text>
            <Text className="text-base text-muted">查看所有分析结果</Text>
          </View>

          {/* Filter Buttons */}
          {exerciseTypes.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">按动作筛选</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => handleFilterChange(null)}
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === null ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedFilter === null ? "text-background" : "text-foreground"
                    }`}
                  >
                    全部
                  </Text>
                </TouchableOpacity>
                {exerciseTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleFilterChange(type)}
                    className={`px-4 py-2 rounded-full ${
                      selectedFilter === type ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selectedFilter === type ? "text-background" : "text-foreground"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Records List */}
          {filteredRecords.length > 0 ? (
            <FlatList
              data={filteredRecords}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="mb-3">
                  <TouchableOpacity
                    onPress={() => handleRecordPress(item)}
                    className="bg-surface border border-border rounded-xl p-4 flex-row items-center gap-4 active:opacity-70"
                  >
                    {/* Thumbnail */}
                    <View className="w-16 h-16 bg-primary rounded-lg items-center justify-center">
                      <Text className="text-2xl">🏋️</Text>
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.exerciseType}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {new Date(item.date).toLocaleDateString("zh-CN")}
                      </Text>
                    </View>

                    {/* Score */}
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center ${
                        item.score >= 80
                          ? "bg-success"
                          : item.score >= 60
                            ? "bg-warning"
                            : "bg-error"
                      }`}
                    >
                      <Text className="text-white font-bold text-lg">{item.score}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteRecord(item.id)}
                    className="mt-2 px-4 py-2 bg-error bg-opacity-10 rounded-lg"
                  >
                    <Text className="text-sm text-error font-semibold text-center">删除</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <View className="bg-surface rounded-2xl p-8 items-center gap-3 border border-border">
              <Text className="text-4xl">📭</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                暂无记录
              </Text>
              <Text className="text-sm text-muted text-center">
                上传视频开始您的第一次分析
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/upload")}
                className="mt-4 bg-primary rounded-lg px-6 py-3"
              >
                <Text className="text-background font-semibold">开始分析</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
