import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";

interface ItemCarrossel {
  imagem: string;
  nome: string;
  lotacao: number;
  endereco: string;
}

interface CarrosselProps {
  dados: ItemCarrossel[];
}

export function Carousel({ dados }: CarrosselProps) {
  const [slideAtual, setSlideAtual] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const screenWidth = Dimensions.get("window").width;

  const corLotacao = (valor: number) => {
    if (valor < 40) return "#4CAF50";
    if (valor < 70) return "#FFA500";
    return "#FF3B30";
  };

  const irParaSlide = (index: number) => {
    if (!flatListRef.current) return;
    flatListRef.current.scrollToOffset({
      offset: index * screenWidth,
      animated: true,
    });
    setSlideAtual(index);
  };

  const proximoSlide = () => {
    const prox = (slideAtual + 1) % dados.length;
    irParaSlide(prox);
  };

  const anteriorSlide = () => {
    const prev = (slideAtual - 1 + dados.length) % dados.length;
    irParaSlide(prev);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dados}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: screenWidth }]}>
            <Image source={{ uri: item.imagem }} style={styles.imagemSlide} />

            <View style={styles.informacoes}>
              <Text style={styles.nomeEstabelecimento}>{item.nome}</Text>

              <View style={styles.lotacaoWrapper}>
                <Text style={styles.textoBranco}>
                  Lotação: {item.lotacao}%
                </Text>
                <View style={styles.barra}>
                  <View
                    style={[
                      styles.barraPreenchida,
                      {
                        width: `${item.lotacao}%`,
                        backgroundColor: corLotacao(item.lotacao),
                      },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.endereco}>{item.endereco}</Text>
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / screenWidth);
          setSlideAtual(index);
        }}
        ref={flatListRef}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* Botões de navegação */}
      {dados.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.botaoNav, styles.botaoEsquerda]}
            onPress={anteriorSlide}
          >
            <Text style={styles.seta}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoNav, styles.botaoDireita]}
            onPress={proximoSlide}
          >
            <Text style={styles.seta}>›</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagemSlide: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  informacoes: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  nomeEstabelecimento: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  endereco: {
    color: "#ddd",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  lotacaoWrapper: {
    marginTop: 6,
  },
  textoBranco: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  barra: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    marginTop: 4,
    margin: "4%",
  },
  barraPreenchida: {
    height: "100%",
    borderRadius: 10,
  },
  botaoNav: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 50,
    zIndex: 10,
  },
  botaoEsquerda: {
    left: 10,
  },
  botaoDireita: {
    right: 10,
  },
  seta: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
