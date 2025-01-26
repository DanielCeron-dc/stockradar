import { router, useFocusEffect , Redirect} from "expo-router";

const Index = () => {
    useFocusEffect(() => {
        router.push("/stocks");
    });

    return null;
}

export default Index;