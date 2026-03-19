# 🎯 GUIDE DE TEST - CURSEUR MAGNÉTIQUE

## 🚀 DÉMARRAGE RAPIDE

```bash
npm install
npm run dev
```

Ouvrir http://localhost:5173

---

## ✨ EFFETS À TESTER

### **1. MAGNÉTISME** 🧲

#### **Comment Tester**
1. Déplacer la souris vers un bouton
2. S'arrêter à ~100px du bouton
3. Observer l'attraction automatique

#### **Ce que Vous Devez Voir**
- ✅ Curseur **attiré** vers le centre du bouton
- ✅ Indicateur **"🧲 ATTIRÉ"** apparaît sous le curseur
- ✅ **4 lignes dorées** apparaissent autour du curseur
- ✅ Curseur **s'agrandit** à 1.5x
- ✅ Couleur devient **or clair** (#f0e68c)
- ✅ **Glow intensifié** avec shadow

#### **Zones Magnétiques**
- 🔘 Bouton "Connecter Wallet"
- 🔘 Tous les boutons de navigation
- 🔘 Boutons des sections
- 🔘 Liens dans le footer
- 🔘 Boutons des formulaires

---

### **2. RIPPLES AU CLIC** 💫

#### **Comment Tester**
1. Cliquer n'importe où sur la page
2. Observer les ondes

#### **Ce que Vous Devez Voir**
- ✅ **3 cercles dorés** qui s'expandent
- ✅ Délai de **0.2s** entre chaque cercle
- ✅ Expansion jusqu'à **3x la taille**
- ✅ Fade out en **800ms**
- ✅ Curseur **rétrécit** à 0.8x pendant le clic
- ✅ Point central devient **brillant**

#### **Test Rapide**
- Cliquer plusieurs fois rapidement
- Observer la superposition des ripples
- Maximum 3 sets de ripples simultanés

---

### **3. PARTICULES ORBITALES** ✨

#### **Comment Tester**
1. Survoler un bouton
2. Maintenir le curseur immobile
3. Observer les particules

#### **Ce que Vous Devez Voir**
- ✅ **3 petites particules dorées**
- ✅ Orbite à **40px** du centre
- ✅ Distribution à **0°, 120°, 240°**
- ✅ Rotation complète en **2 secondes**
- ✅ Glow autour de chaque particule
- ✅ Mouvement **fluide et continu**

#### **Test Avancé**
- Passer d'un bouton à l'autre
- Les particules doivent apparaître/disparaître en douceur

---

### **4. TRAÎNÉE LUMINEUSE** 🌟

#### **Comment Tester**
1. Déplacer la souris rapidement
2. Observer la traînée

#### **Ce que Vous Devez Voir**
- ✅ **Halo doré** qui suit le curseur
- ✅ Légèrement **en retard** (latence de ~200ms)
- ✅ **Blur** important (25-30px)
- ✅ **Pulse animation** (scale 1 → 1.5 → 1)
- ✅ Opacity **variant** (0.3 → 0.1)
- ✅ **Gradient radial** visible

#### **Mouvement Idéal**
- Dessiner des cercles avec la souris
- La traînée doit créer un effet de "vortex"

---

### **5. ROTATION DIRECTIONNELLE** 🔄

#### **Comment Tester**
1. Déplacer la souris en ligne droite
2. Changer brusquement de direction
3. Observer la rotation

#### **Ce que Vous Devez Voir**
- ✅ Curseur **s'oriente** vers la direction
- ✅ Rotation **fluide** (spring physics)
- ✅ Pas de **saccades**
- ✅ Gradient interne **tourne avec** le curseur

#### **Pattern de Test**
```
Mouvement :    →  ↓  ←  ↑
Rotation :    0° 90° 180° 270°
```

---

### **6. MULTI-COUCHES** 🎭

#### **Comment Tester**
1. S'approcher d'un bouton lentement
2. Observer les différentes couches

#### **Couches Visibles** (de l'extérieur vers l'intérieur)

**Couche 7 : Particules orbitales**
- 3 points qui tournent (au hover)

**Couche 6 : Point central**
- Petit point brillant au centre

**Couche 5 : Curseur principal**
- Cercle doré avec border

**Couche 4 : Cercle de traînée**
- Cercle secondaire qui tourne

**Couche 3 : Halo externe**
- Grande zone lumineuse

**Couche 2 : Ripples**
- Apparaissent au clic

**Couche 1 : Traînée**
- Gradient animé en arrière-plan

---

### **7. PARTICULES DE MOUVEMENT** 💨

#### **Comment Tester**
1. Déplacer la souris **très rapidement**
2. Observer les particules générées

#### **Ce que Vous Devez Voir**
- ✅ **Particules dorées** créées en mouvement
- ✅ Génération **toutes les 50ms** si vitesse > 5px
- ✅ **Taille aléatoire** (2-6px)
- ✅ **Couleurs variées** (#d4af37, #f0e68c, #ffd700)
- ✅ S'envolent **aléatoirement**
- ✅ Disparaissent en **1 seconde**
- ✅ Maximum **20 particules** simultanées

#### **Test de Vitesse**
- Secouer la souris rapidement
- Devrait créer un "nuage" de particules dorées

---

## 🎨 TESTS VISUELS PAR ZONE

### **Zone 1 : Navigation** (en haut)
```
Test : Survoler les liens du menu
Résultat : Magnétisme + particules
```

### **Zone 2 : Bouton "Connecter Wallet"**
```
Test : Approcher lentement
Résultat : Attraction forte + indicateur
```

### **Zone 3 : Hero Section**
```
Test : Bouton "Découvrir"
Résultat : Magnétisme + effets complets
```

### **Zone 4 : Sections avec boutons**
```
Test : Chaque bouton CTA
Résultat : Tous magnétiques
```

### **Zone 5 : Footer**
```
Test : Liens du footer
Résultat : Attraction vers chaque lien
```

---

## 🎯 CHECKLIST COMPLÈTE

### **Visuels**
- [ ] Curseur est **visible** et **doré**
- [ ] Curseur **remplace** le curseur par défaut
- [ ] **7 couches** sont visibles
- [ ] **Animations fluides** à 60 FPS
- [ ] **Couleurs correctes** (or/or clair)

### **Magnétisme**
- [ ] **Attraction** vers boutons (< 150px)
- [ ] **Indicateur** "🧲 ATTIRÉ" apparaît
- [ ] **4 lignes** directionnelles visibles
- [ ] **Force progressive** (plus proche = plus fort)
- [ ] **Release** doux quand on s'éloigne

### **Interactions**
- [ ] **Ripples** au clic (3 cercles)
- [ ] **Particules orbitales** au hover
- [ ] **Traînée lumineuse** en mouvement
- [ ] **Particules volantes** si mouvement rapide
- [ ] **Rotation** selon direction

### **Performance**
- [ ] **60 FPS** constant
- [ ] **Pas de lag** au mouvement
- [ ] **Smooth animations**
- [ ] **Pas de memory leak**
- [ ] **Cleanup correct** des particules

---

## 🐛 DEBUGGING

### **Curseur Pas Visible**
```typescript
// Vérifier dans la console :
document.body.style.cursor
// Doit être 'none'
```

### **Pas de Magnétisme**
```typescript
// Vérifier les éléments :
document.querySelectorAll('button, a').length
// Doit être > 0
```

### **Performance Faible**
```typescript
// Limiter les particules :
setParticles(prev => prev.slice(-10)) // Au lieu de -20
```

---

## 🎬 SCÉNARIO DE TEST COMPLET

### **Test 1 : Premier Contact** (30 secondes)
1. ✅ Ouvrir la page
2. ✅ Bouger la souris → curseur apparaît
3. ✅ Cliquer → ripples apparaissent
4. ✅ Bouger vite → particules créées

### **Test 2 : Navigation** (1 minute)
1. ✅ Survoler menu → magnétisme
2. ✅ Cliquer lien → navigation + ripples
3. ✅ Scroller → curseur suit

### **Test 3 : Boutons** (2 minutes)
1. ✅ Approcher "Connecter Wallet" → attraction
2. ✅ Observer indicateur "🧲 ATTIRÉ"
3. ✅ Cliquer → ripples + navigation
4. ✅ Tester chaque bouton de la page

### **Test 4 : Effets Avancés** (2 minutes)
1. ✅ Dessiner des cercles rapides → particules
2. ✅ Zigzag rapide → rotation directionnelle
3. ✅ Hover prolongé sur bouton → particules orbitales
4. ✅ Clicks multiples rapides → ripples superposés

---

## 🎨 EXPÉRIENCE ATTENDUE

### **Sensation Générale**
- 🌟 **Luxueux et Premium**
- 🧲 **Interactif et Réactif**
- ✨ **Magique et Fluide**
- 💎 **Sophistiqué et Raffiné**

### **Comparaison**
```
Curseur Standard :   ●
Curseur THESORIA :   ✦ ○ ◎ ● ◉ ○ ✦
                    (7 couches + effets)
```

---

## 📊 METRICS DE SUCCÈS

### **Performance**
- ✅ **FPS : ≥ 60**
- ✅ **Latence : < 16ms**
- ✅ **Smooth : 100%**

### **Visuels**
- ✅ **Couches : 7**
- ✅ **Particules max : 20**
- ✅ **Ripples par clic : 3**
- ✅ **Orbites : 3**

### **Interactions**
- ✅ **Zone magnétique : 150px**
- ✅ **Pull strength : 30%**
- ✅ **Hover scale : 1.5x**
- ✅ **Click scale : 0.8x**

---

## 🎉 CONCLUSION

Si **TOUS** les tests passent, vous avez :

✅ **Le curseur le plus avancé du Web**
✅ **Une expérience utilisateur AAA**
✅ **Un design de niveau bancaire suisse**
✅ **Des effets visuels spectaculaires**
✅ **Une performance optimale**

**🚀 THESORIA - L'Excellence en Mouvement ! ✨**
