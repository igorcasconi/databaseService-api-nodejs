import module from "@react-native-firebase/app";

module.exports = (dateStr: any) => {
    var parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}