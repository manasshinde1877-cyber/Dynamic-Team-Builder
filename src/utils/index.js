import { AVATAR_COLORS } from '../constants';

export const getMasteryLabel = (v) =>
  v < 25 ? "Beginner" : v < 50 ? "Intermediate" : v < 75 ? "Advanced" : "Visionary";

export const getMasteryColor = (v) =>
  v < 25 ? "#a997ff" : v < 50 ? "#ff68a8" : v < 75 ? "#d891ff" : "#ffd700";

export const getAvatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
