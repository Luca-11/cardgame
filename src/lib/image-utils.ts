export function getCardImageUrl(imageId: string) {
  // Si l'URL est déjà complète (commence par http ou https), la retourner telle quelle
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) {
    return imageId;
  }

  // En développement, utiliser les images locales
  return `/images/cards/default-card.jpg`;
}
