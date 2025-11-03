import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Telas fora das Tabs */}
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="esqueceuSenha" />  {/* nossa tela atual */}
      <Stack.Screen name="redefinirSenha" /> {/* tela de redefinir senha */}

      {/* Tabs, só acessíveis após login */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
