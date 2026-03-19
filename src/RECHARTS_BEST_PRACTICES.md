# 📊 Recharts Best Practices - THESORIA

## Problème : Erreur "width(0) and height(0) should be greater than 0"

Cette erreur se produit lorsque `ResponsiveContainer` ne peut pas calculer ses dimensions.

### ❌ **Anti-Pattern (Cause des Erreurs)**

```tsx
<div style={{ height: 180 }}>
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      {/* ... */}
    </AreaChart>
  </ResponsiveContainer>
</div>
```

**Problème** : Le navigateur ne calcule pas toujours correctement `height="100%"` même si le parent a une hauteur fixe.

---

## ✅ **Solution 1 : Dimensions Explicites (Recommandé)**

```tsx
<div className="w-full" style={{ height: 180, minHeight: 180 }}>
  <ResponsiveContainer width="100%" height={180}>
    <AreaChart data={data}>
      {/* ... */}
    </AreaChart>
  </ResponsiveContainer>
</div>
```

**Avantages** :
- ✅ Pas d'erreurs de calcul
- ✅ Performance optimale
- ✅ Comportement prévisible

---

## ✅ **Solution 2 : Utiliser SafeResponsiveContainer**

Si vous voulez vraiment utiliser des pourcentages :

```tsx
import SafeResponsiveContainer from "../components/SafeResponsiveContainer";

<div className="w-full" style={{ height: 200 }}>
  <SafeResponsiveContainer width="100%" height="100%" minHeight={200}>
    <AreaChart data={data}>
      {/* ... */}
    </AreaChart>
  </SafeResponsiveContainer>
</div>
```

---

## 📋 **Checklist pour Tous les Graphiques**

Avant de créer un graphique Recharts, vérifiez :

- [ ] Le conteneur parent a une **hauteur explicite** (pas seulement une classe Tailwind)
- [ ] `ResponsiveContainer` a soit :
  - [ ] `height={number}` explicite (ex: `height={180}`)
  - [ ] OU `minHeight={number}` si vous utilisez `height="100%"`
- [ ] Le parent a `className="w-full"` si vous utilisez `width="100%"`
- [ ] Ajoutez `minHeight` au style du parent pour plus de sécurité

---

## 🎯 **Exemples Corrects pour Différents Types de Graphiques**

### **AreaChart (Timeline)**

```tsx
<div className="w-full" style={{ height: 180, minHeight: 180 }}>
  <ResponsiveContainer width="100%" height={180}>
    <AreaChart data={pollHistory}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
      <XAxis dataKey="t" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
      <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
      <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #d4af37" }} />
      <Area type="monotone" dataKey="tvl" stroke="#d4af37" fill="rgba(212,175,55,0.15)" />
    </AreaChart>
  </ResponsiveContainer>
</div>
```

### **PieChart**

```tsx
<div style={{ width: 140, height: 140, minWidth: 140, minHeight: 140 }}>
  <PieChart width={140} height={140}>
    <Pie
      data={kycData}
      cx="50%"
      cy="50%"
      innerRadius={35}
      outerRadius={55}
      paddingAngle={3}
      dataKey="value"
    >
      {kycData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
    </Pie>
    <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(212,175,55,0.3)", fontSize: 10 }} />
  </PieChart>
</div>
```

**Note:** Pour les graphiques avec dimensions fixes, n'utilisez PAS ResponsiveContainer.

### **LineChart**

```tsx
<div className="w-full" style={{ height: 280, minHeight: 280 }}>
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={strategies}>
      <CartesianGrid stroke="rgba(212,175,55,0.05)" />
      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
      <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
      <Tooltip />
      <Line type="monotone" dataKey="profit" stroke="#d4af37" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>
```

### **BarChart**

```tsx
<div className="w-full" style={{ height: 220, minHeight: 220 }}>
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={volumeData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
      <XAxis dataKey="date" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
      <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
      <Tooltip />
      <Bar dataKey="volume" fill="#d4af37" />
    </BarChart>
  </ResponsiveContainer>
</div>
```

---

## 🐛 **Debugging : Comment Vérifier Si Vos Graphiques Fonctionnent**

### **1. Vérifiez la console du navigateur**

Ouvrez DevTools (F12) → Console. Cherchez :
```
⚠️ The width(0) and height(0) of chart should be greater than 0
```

### **2. Inspectez l'élément**

Clic droit sur le graphique → Inspecter → Computed

Vérifiez que :
- **width** > 0
- **height** > 0

Si width ou height = 0, le parent n'a pas de dimensions définies.

### **3. Testez avec des dimensions fixes**

Remplacez temporairement :
```tsx
// Avant (problématique)
<ResponsiveContainer width="100%" height="100%">

// Après (test)
<ResponsiveContainer width={500} height={300}>
```

Si ça fonctionne, le problème vient du calcul de `100%`.

---

## 🎨 **Hauteurs Recommandées par Type de Graphique**

| Type de Graphique | Hauteur Recommandée | Use Case |
|-------------------|---------------------|----------|
| **Timeline (Area)** | 180-200px | Profit history, TVL over time |
| **Pie Chart** | 140-160px | Distribution (KYC, allocations) |
| **Bar Chart** | 220-250px | Volume, comparaisons |
| **Line Chart** | 250-300px | Stratégies, performance multi-variables |
| **Composed Chart** | 300-350px | Données complexes (volume + price) |

---

## ⚡ **Performance Tips**

### **1. Limiter le nombre de points de données**

```tsx
// Limiter à 50 points max pour éviter lag
const chartData = rawData.slice(-50);
```

### **2. Utiliser des clés stables**

```tsx
<Area key="area-tvl" /* ... */ />
<XAxis key="xaxis" /* ... */ />
<YAxis key="yaxis" /* ... */ />
```

### **3. Memoïser les données**

```tsx
const chartData = useMemo(() => {
  return rawData.map(d => ({ time: d.t, value: d.v }));
}, [rawData]);
```

---

## ✅ **Corrections Appliquées dans THESORIA**

Les fichiers suivants ont été corrigés :

1. ✅ `/pages/GodModePage.tsx`
   - Polling History Chart : `height={180}`
   - KYC Distribution Pie : `height={140}`
   - Gas Price History : `height={170}`

2. ✅ `/components/GodModePanel.tsx`
   - Profit Cumulé : `height={200}`
   - Performance par Stratégie : `height={280}`

3. ✅ Autres composants déjà corrects :
   - `FlashBotDashboard.tsx` : utilise `height={300}`
   - `MEVProfitChart.tsx` : utilise `height={320}`
   - `ProfitTracker.tsx` : utilise `height={200}`

---

## 🚨 **Ne Faites JAMAIS Ceci**

```tsx
// ❌ MAUVAIS : Parent sans hauteur
<div>
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart />
  </ResponsiveContainer>
</div>

// ❌ MAUVAIS : Parent avec seulement flex
<div className="flex-1">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart />
  </ResponsiveContainer>
</div>

// ❌ MAUVAIS : Parent avec seulement h-full
<div className="h-full">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart />
  </ResponsiveContainer>
</div>
```

**Pourquoi ?** Tailwind classes comme `h-full`, `flex-1` ne définissent pas toujours une hauteur calculable pour Recharts.

---

## 📦 **Composant Réutilisable : SafeResponsiveContainer**

Utilisez `/components/SafeResponsiveContainer.tsx` pour des graphiques avec dimensions dynamiques :

```tsx
import SafeResponsiveContainer from "../components/SafeResponsiveContainer";

<SafeResponsiveContainer height={200} minHeight={200}>
  <AreaChart data={data}>
    {/* ... */}
  </AreaChart>
</SafeResponsiveContainer>
```

---

## 🎯 **Résumé des Règles d'Or**

1. **Toujours** définir une hauteur explicite sur le parent (`style={{ height: 200 }}`)
2. **Toujours** passer une hauteur numérique à `ResponsiveContainer` (`height={200}`)
3. **Optionnel** : Ajouter `minHeight` au parent pour plus de robustesse
4. **Jamais** utiliser `height="100%"` sans `minHeight`
5. **Utiliser** `className="w-full"` pour la largeur responsive

---

## 🔧 **Checklist de Migration**

Si vous migrez un ancien graphique :

- [ ] Trouvez le `ResponsiveContainer`
- [ ] Vérifiez le parent : a-t-il `style={{ height: X }}`?
- [ ] Remplacez `height="100%"` par `height={X}` (même valeur que le parent)
- [ ] Ajoutez `minHeight: X` au parent si nécessaire
- [ ] Testez dans la console : plus d'erreur `width(0) height(0)` ?
- [ ] Vérifiez visuellement : le graphique s'affiche correctement ?

---

**Dernière mise à jour** : 8 mars 2026  
**Responsable** : God Mode Team - THESORIA