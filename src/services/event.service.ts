import axios from "axios";
import { Event } from "@/types/event";

const API = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getAllEvents = async (): Promise<Event[]> => {
  const { data } = await axios.get(`${API}/events`);
  return data;
};
