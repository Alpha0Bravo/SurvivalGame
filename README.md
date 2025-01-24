# Jeu de Tir Simple

Un jeu de tir simple créé avec p5.js pour un projet scolaire. L'objectif est de tuer les ennemis tout en évitant d'être touché. Plus vous tuez d'ennemis, plus le jeu devient difficile avec l'apparition de nouveaux ennemis et de power-ups.

## Comment jouer

- **Objectif :** Tuer autant d'ennemis que possible tout en restant en vie. Votre santé diminuera si des ennemis vous touchent, alors gardez un œil sur votre barre de santé.
- **Contrôles :**
  - **Souris :** Cliquez pour tirer des balles vers la position de la souris.
  - **Mouvement :** Controle classique avec WASD.
- **Mécaniques du jeu :**
  - Les ennemis apparaissent aléatoirement et poursuivent le joueur lorsqu'ils sont à une certaine distance.
  - Des power-ups peuvent apparaître pour donner des avantages au joueur.
  - Plus vous tuez d'ennemis, plus le jeu devient difficile avec des apparitions d'ennemis plus fréquentes.

## Fonctionnalités du jeu

- **Barre de santé :** Le joueur dispose d'une barre de santé qui se vide lorsqu'il est attaqué par les ennemis.
- **IA des ennemis :** Les ennemis poursuivent le joueur et tentent de le toucher.
- **Tir de balles :** Cliquez pour tirer des balles qui détruisent les ennemis.
- **Power-ups :** Des power-ups apparaissent de manière aléatoire et offrent des avantages lorsqu'ils sont collectés.
- **Apparition des ennemis :** Les ennemis apparaissent en fonction du nombre d'ennemis déjà tués, augmentant ainsi la difficulté.

## Détails techniques
  - **Les ennemis :**
    - Il suive la mécanique des "flock" (appelé horde dans le code)
    - En mode wander jusqu'a ce que le joueur soit assez proche puis switch en mode pursue.
  - **Le Joueur :**
    - Les ennemis ET le joueur rebonissent sur les paroie, tandis que les projectile sont simplement supprimés lorsqu'ils sortent du cadre.
    - Est limité par "ms (movement speed)", "hp (health points)".
  - **Les projectile :**
    - Sont limités par "fire rate" et "bullet speed".
    - Elimine UN SEUL ennemi par projectile.
