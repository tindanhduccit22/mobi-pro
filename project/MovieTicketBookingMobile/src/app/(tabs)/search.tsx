import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  getAllMovies,
  Movie,
} from "../../api/movieApi";

const screenWidth = Dimensions.get("window").width;

export default function SearchScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Refs to keep track of ScrollViews and layout measurements of chips
  const genreScrollRef = useRef<ScrollView>(null);
  const statusScrollRef = useRef<ScrollView>(null);
  const genreLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});
  const statusLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (error) {
      console.log(error);
    }
  };

  const genres = useMemo(() => {
    const list = movies.map(movie => movie.genreName);
    return [
      "All",
      ...Array.from(new Set(list))
    ];
  }, [movies]);

  const statuses = useMemo(() => {
    const list = movies.map(movie => movie.status);
    return [
      "All",
      ...Array.from(new Set(list))
    ];
  }, [movies]);

  const scrollToCenter = (
    item: string,
    scrollRef: React.RefObject<ScrollView | null>,
    layoutsRef: React.MutableRefObject<{ [key: string]: { x: number; width: number } }>
  ) => {
    const layout = layoutsRef.current[item];
    if (layout && scrollRef.current) {
      // Calculate X position to center the chip on screen (accounting for horizontal padding of 16px on each side)
      const screenPadding = 16;
      const availableWidth = screenWidth - (screenPadding * 2);
      const targetX = layout.x - (availableWidth / 2) + (layout.width / 2);
      
      scrollRef.current.scrollTo({
        x: Math.max(0, targetX),
        animated: true,
      });
    }
  };

  const handleSelectGenre = (item: string) => {
    setSelectedGenre(item);
    scrollToCenter(item, genreScrollRef, genreLayouts);
  };

  const handleSelectStatus = (item: string) => {
    setSelectedStatus(item);
    scrollToCenter(item, statusScrollRef, statusLayouts);
  };

  const filteredMovies = movies.filter(movie => {
    const nameMatch = movie.title
      .toLowerCase()
      .includes(keyword.toLowerCase());

    const genreMatch =
      selectedGenre === "All" ||
      movie.genreName === selectedGenre;

    const statusMatch =
      selectedStatus === "All" ||
      movie.status === selectedStatus;

    return nameMatch && genreMatch && statusMatch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🎬 Movie Ticket</Text>
        <Text style={styles.heading}>
          Search & Filter Movie
        </Text>

        <TextInput
          placeholder="Search movie name..."
          value={keyword}
          onChangeText={setKeyword}
          style={styles.search}
        />

        <Text style={styles.label}>Genre</Text>
        <View style={styles.filterWrapper}>
          <ScrollView
            ref={genreScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
            nestedScrollEnabled={true}
            directionalLockEnabled={true}
          >
            {genres.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelectGenre(item)}
                onLayout={(event) => {
                  genreLayouts.current[item] = {
                    x: event.nativeEvent.layout.x,
                    width: event.nativeEvent.layout.width,
                  };
                }}
                style={[
                  styles.chip,
                  selectedGenre === item && styles.activeChip
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedGenre === item && styles.activeText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.filterWrapper}>
          <ScrollView
            ref={statusScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
            nestedScrollEnabled={true}
            directionalLockEnabled={true}
          >
            {statuses.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelectStatus(item)}
                onLayout={(event) => {
                  statusLayouts.current[item] = {
                    x: event.nativeEvent.layout.x,
                    width: event.nativeEvent.layout.width,
                  };
                }}
                style={[
                  styles.chip,
                  selectedStatus === item && styles.activeChip
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStatus === item && styles.activeText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.result}>
          {filteredMovies.length} movies
        </Text>

        <View style={styles.gridContainer}>
            {filteredMovies.map((item) => (
              <TouchableOpacity
                key={item.movieID.toString()}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(`/movie/${item.movieID}`)
                }
              >

                <Image
                  source={{
                    uri: item.posterURL || "https://via.placeholder.com/200"
                  }}
                  style={styles.poster}
                />


                <Text
                  style={styles.movieTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>


                <Text style={styles.genre}>
                  {item.genreName} • {item.duration} min
                </Text>


                <Text style={styles.status}>
                  {item.status}
                </Text>


              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 18,
  },
  search: {
    height: 52,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterWrapper: {
    marginBottom: 15,
    height: 45,
  },
  filterScrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    fontSize: 14,
    color: "#555",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 20,
  },
  poster: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "#ddd",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  genre: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
});