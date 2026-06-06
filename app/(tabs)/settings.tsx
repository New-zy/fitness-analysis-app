import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">设置</Text>
            <Text className="text-base text-muted">管理应用偏好和通知</Text>
          </View>

          {/* Notification Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">通知设置</Text>

            <View className="bg-surface border border-border rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">推送通知</Text>
                <Text className="text-sm text-muted mt-1">接收分析完成和改进提示</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#ccc", true: "#0a7ea4" }}
              />
            </View>

            <View className="bg-surface border border-border rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">声音提示</Text>
                <Text className="text-sm text-muted mt-1">分析完成时播放声音</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#ccc", true: "#0a7ea4" }}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">关于应用</Text>

            <View className="bg-surface border border-border rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-semibold text-foreground">应用版本</Text>
                <Text className="text-base text-muted">1.0.0</Text>
              </View>
              <View className="border-t border-border pt-4">
                <Text className="text-base font-semibold text-foreground mb-2">应用名称</Text>
                <Text className="text-base text-muted">FitCorrect AI 健身纠错</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-surface border border-border rounded-xl p-4 active:opacity-70">
              <Text className="text-base font-semibold text-primary text-center">
                📖 隐私政策
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface border border-border rounded-xl p-4 active:opacity-70">
              <Text className="text-base font-semibold text-primary text-center">
                📋 用户协议
              </Text>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">支持与反馈</Text>

            <TouchableOpacity className="bg-surface border border-border rounded-xl p-4 active:opacity-70">
              <Text className="text-base font-semibold text-foreground">📧 联系我们</Text>
              <Text className="text-sm text-muted mt-1">zhiyuanxia401@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface border border-border rounded-xl p-4 active:opacity-70">
              <Text className="text-base font-semibold text-foreground">⭐ 评价应用</Text>
              <Text className="text-sm text-muted mt-1">在应用商店评价我们</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-4 pt-4 border-t border-border">
            <Text className="text-sm text-muted">FitCorrect AI © 2026</Text>
            <Text className="text-xs text-muted">
              专业的健身动作分析纠正平台
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
