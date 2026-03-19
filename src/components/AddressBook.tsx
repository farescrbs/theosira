/**
 * Carnet d'adresses - Sauvegarde contacts blockchain
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Trash2, Edit2, Save, X, Copy, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddressBookProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

interface Contact {
  id: string;
  name: string;
  address: string;
  category: 'personal' | 'exchange' | 'contract' | 'other';
  notes: string;
}

const CATEGORIES = [
  { value: 'personal', label: 'Personnel', color: '#3b82f6' },
  { value: 'exchange', label: 'Exchange', color: '#f59e0b' },
  { value: 'contract', label: 'Contrat', color: '#8b5cf6' },
  { value: 'other', label: 'Autre', color: '#6b7280' },
];

export default function AddressBook({ web3, fmtAddr, GCard, STitle }: AddressBookProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: 'personal' as Contact['category'],
    notes: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('thesoria-address-book');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur chargement contacts:', error);
      }
    }
  }, []);

  // Save to localStorage
  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('thesoria-address-book', JSON.stringify(newContacts));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.address) {
      toast.error("Nom et adresse requis");
      return;
    }

    if (formData.address.length !== 42 || !formData.address.startsWith('0x')) {
      toast.error("Adresse Ethereum invalide");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      ...formData,
    };

    saveContacts([...contacts, newContact]);
    toast.success(`Contact ajouté: ${formData.name}`);
    setFormData({ name: '', address: '', category: 'personal', notes: '' });
    setShowAddForm(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      address: contact.address,
      category: contact.category,
      notes: contact.notes,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;

    const updated = contacts.map(c =>
      c.id === editingId ? { ...c, ...formData } : c
    );

    saveContacts(updated);
    toast.success("Contact mis à jour");
    setEditingId(null);
    setFormData({ name: '', address: '', category: 'personal', notes: '' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer ce contact ?")) return;
    
    const filtered = contacts.filter(c => c.id !== id);
    saveContacts(filtered);
    toast.success("Contact supprimé");
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Adresse copiée!");
  };

  const exportContacts = () => {
    const data = JSON.stringify(contacts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thesoria-contacts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Contacts exportés!");
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <div className="flex items-center justify-between mb-4">
        <STitle icon={BookOpen} title="ADDRESS BOOK" />
        <div className="flex gap-2">
          <button
            onClick={exportContacts}
            disabled={contacts.length === 0}
            className="px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-[10px] disabled:opacity-30"
          >
            Export
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 rounded-sm hover:bg-[#d4af37]/30 transition-all text-[10px] inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Add/Edit Form */}
        <AnimatePresence>
          {(showAddForm || editingId) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-black/30 border border-[#d4af37]/30 space-y-3">
                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">NOM</label>
                  <input
                    type="text"
                    placeholder="Vitalik"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">ADRESSE</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">CATÉGORIE</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Contact['category'] })}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">NOTES</label>
                  <textarea
                    placeholder="Notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50 resize-none"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={editingId ? handleUpdate : handleAdd}
                    className="flex-1 px-4 py-2 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 rounded-sm hover:bg-[#d4af37]/30 transition-all text-xs inline-flex items-center justify-center gap-2"
                  >
                    <Save className="w-3 h-3" />
                    {editingId ? 'Mettre à jour' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ name: '', address: '', category: 'personal', notes: '' });
                    }}
                    className="px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs inline-flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-10 h-10 mx-auto mb-2 text-white/20" />
            <p className="text-sm text-white/50">Aucun contact enregistré</p>
            <p className="text-xs text-white/30 mt-1">Cliquez sur "Ajouter" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {contacts.map((contact) => {
              const category = CATEGORIES.find(c => c.value === contact.category);
              
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-semibold text-white">{contact.name}</div>
                        <div
                          className="px-2 py-0.5 rounded text-[9px] font-medium"
                          style={{
                            backgroundColor: `${category?.color}20`,
                            color: category?.color,
                            border: `1px solid ${category?.color}40`,
                          }}
                        >
                          {category?.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs text-white/60 font-mono">
                          {fmtAddr(contact.address)}
                        </code>
                        <button
                          onClick={() => handleCopy(contact.address)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Copy className="w-3 h-3 text-white/40" />
                        </button>
                      </div>

                      {contact.notes && (
                        <div className="text-[10px] text-white/40 mt-1">
                          {contact.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {contacts.length > 0 && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] text-white/40">
              <span>{contacts.length} contact{contacts.length > 1 ? 's' : ''}</span>
              <div className="flex gap-3">
                {CATEGORIES.map(cat => {
                  const count = contacts.filter(c => c.category === cat.value).length;
                  if (count === 0) return null;
                  return (
                    <span key={cat.value} style={{ color: cat.color }}>
                      {cat.label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GCard>
  );
}
