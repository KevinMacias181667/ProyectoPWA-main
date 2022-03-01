import { supabaseClient } from "../../lib/supabaseClient";

export default function handler(req, res) {
  supabaseClient.auth.api.setAuthCookie(req, res);
}