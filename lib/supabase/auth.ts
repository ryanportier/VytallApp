import { createClient } from "./server";
import { redirect } from "next/navigation";
import type { VUser } from "@/types";

/**
 * Get the current authenticated user or redirect to /login.
 * Use in Server Components and Route Handlers.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Get the current authenticated user without redirecting.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the VYTALL profile for the current user.
 * Returns null if profile not yet created (needs onboarding).
 */
export async function getUserProfile(): Promise<VUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as VUser | null;
}

/**
 * Require a complete VYTALL profile.
 * Redirects to onboarding if profile doesn't exist.
 */
export async function requireProfile(): Promise<VUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/app/onboarding");

  return profile as VUser;
}
