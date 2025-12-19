import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function useUserAuth() {
  const { user } = useSelector((state: RootState) => state.auth); 
  return !!user; // returns true if user exists, false otherwise
}
