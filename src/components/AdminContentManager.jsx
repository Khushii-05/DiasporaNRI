import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContentUpdate } from '../context/ContentUpdateContext';
import Icon from './Icon';
import {
  deleteContentBlock,
  getAdminPageContent,
  upsertContentBlock
} from '../services/contentService';
import {
  createBackup,
  getBackups,
  restoreBackup,
  deleteBackup
} from '../services/backupService';

const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'associates', label: 'Associates' },
  { id: 'investment', label: 'Investment' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Contact' }
];

export default function AdminContentManager() {
  const { currentUser } = useAuth();
  const { triggerContentUpdate } = useContentUpdate();
  const [activePage, setActivePage] = useState('home');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBlock, setNewBlock] = useState({ key: '', value: '' });
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backups, setBackups] = useState([]);
  const [backupName, setBackupName] = useState('');
  const [loadingBackups, setLoadingBackups] = useState(false);

  const pageLabel = useMemo(() => {
    return PAGES.find(page => page.id === activePage)?.label || 'Page';
  }, [activePage]);

  const loadBlocks = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = await currentUser.getIdToken();
      const data = await getAdminPageContent(activePage, token);
      setBlocks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, [activePage, currentUser]);

  const handleChange = (blockId, field, value) => {
    setBlocks(prev => prev.map(block => {
      const id = block._id || block.id;
      return id === blockId ? { ...block, [field]: value } : block;
    }));
  };

  const handleSaveBlock = async (block) => {
    if (!currentUser) {
      return;
    }

    try {
      setError('');
      const token = await currentUser.getIdToken();
      const saved = await upsertContentBlock({
        page: activePage,
        key: block.key,
        value: block.value,
        valueType: 'text'
      }, token);

      // Ensure id field is set from _id
      const savedWithId = { ...saved, id: saved._id || saved.id };
      setBlocks(prev => prev.map(item => {
        const itemId = item._id || item.id;
        const savedId = saved._id || saved.id;
        return itemId === savedId ? savedWithId : item;
      }));
      setSuccess('Content saved successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (blockId) => {
    if (!currentUser) {
      return;
    }

    if (!window.confirm('Delete this content block?')) {
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await deleteContentBlock(blockId, token);
      setBlocks(prev => prev.filter(block => (block._id || block.id) !== blockId));
      setSuccess('Content deleted');
      triggerContentUpdate(); // Trigger refresh on all pages
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddBlock = async (event) => {
    event.preventDefault();

    if (!newBlock.key.trim()) {
      setError('Key is required');
      return;
    }

    if (!currentUser) {
      return;
    }

    try {
      setError('');
      const token = await currentUser.getIdToken();
      const saved = await upsertContentBlock({
        page: activePage,
        key: newBlock.key.trim(),
        value: newBlock.value || '',
        valueType: 'text'
      }, token);

      setBlocks(prev => {
        const existingIndex = prev.findIndex(item => item.key === saved.key);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = saved;
          return next;
        }
        return [...prev, saved];
      });
      setNewBlock({ key: '', value: '' });
      setSuccess('Content added');
      triggerContentUpdate(); // Trigger refresh on all pages
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenBackupModal = async () => {
    if (!currentUser) return;
    try {
      setLoadingBackups(true);
      const token = await currentUser.getIdToken();
      const backupsList = await getBackups(token);
      setBackups(backupsList);
      setShowBackupModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      setError('Backup name is required');
      return;
    }

    if (!currentUser) return;

    try {
      setError('');
      const token = await currentUser.getIdToken();
      await createBackup(backupName.trim(), `Backup of ${pageLabel} page`, token);
      setBackupName('');
      setSuccess('Backup created successfully');
      setTimeout(() => setSuccess(''), 2000);
      
      // Reload backups list
      const backupsList = await getBackups(token);
      setBackups(backupsList);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm('This will restore ALL content to this backup. Are you sure?')) {
      return;
    }

    if (!currentUser) return;

    try {
      setError('');
      const token = await currentUser.getIdToken();
      await restoreBackup(backupId, token);
      setSuccess('Content restored successfully!');
      setShowBackupModal(false);
      setBackupName('');
      triggerContentUpdate(); // Trigger refresh on all pages
      setTimeout(() => {
        loadBlocks();
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBackupFile = async (backupId) => {
    if (!window.confirm('Delete this backup? This cannot be undone.')) {
      return;
    }

    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      await deleteBackup(backupId, token);
      setBackups(prev => prev.filter(b => b._id !== backupId));
      setSuccess('Backup deleted');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon name="edit" className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Content Manager</h2>
          </div>
          <p className="text-gray-400">Edit page text and copy for the {pageLabel} page.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleOpenBackupModal}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            title="Create, view, and restore content backups"
          >
            <Icon name="backup" className="w-5 h-5" />
            Backup & Restore
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activePage === page.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-blue-400/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Content Block</h3>
        <form onSubmit={handleAddBlock} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="key (e.g., hero_title)"
            value={newBlock.key}
            onChange={(event) => setNewBlock(prev => ({ ...prev, key: event.target.value }))}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="value"
            value={newBlock.value}
            onChange={(event) => setNewBlock(prev => ({ ...prev, value: event.target.value }))}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4"
          >
            + Add Block
          </button>
        </form>
      </div>

      <div className="bg-slate-800/40 border border-blue-400/20 rounded-lg p-6">
        {loading ? (
          <p className="text-gray-400">Loading content...</p>
        ) : blocks.length === 0 ? (
          <p className="text-gray-400">No content blocks for this page yet. Add one above!</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Existing Content ({blocks.length})</h3>
              <button
                onClick={loadBlocks}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-300 px-3 py-1 rounded transition flex items-center gap-1"
              >
                <Icon name="refresh" className="w-4 h-4" />
                Refresh
              </button>
            </div>
            {blocks.map(block => {
              const blockId = block._id || block.id;
              return (
                <div key={blockId} className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">{block.key}</p>
                      <textarea
                        rows="3"
                        value={block.value || ''}
                        onChange={(event) => handleChange(blockId, 'value', event.target.value)}
                        className="mt-2 w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none transition"
                        placeholder="Enter content value..."
                      />
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleSaveBlock(block)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-2"
                      >
                        <Icon name="check" className="w-5 h-5" />
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete(blockId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-2"
                      >
                        <Icon name="delete" className="w-5 h-5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Icon name="backup" className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Backup & Restore</h3>
              </div>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Create Backup Section */}
              <div className="bg-slate-800/40 border border-blue-400/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Create New Backup</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Before redesign, Daily backup"
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2"
                  />
                  <button
                    onClick={handleCreateBackup}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-2"
                  >
                    <Icon name="save" className="w-5 h-5" />
                    Create
                  </button>
                </div>
              </div>

              {/* Backups List Section */}
              <div className="bg-slate-800/40 border border-blue-400/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Available Backups</h4>
                {loadingBackups ? (
                  <p className="text-gray-400">Loading backups...</p>
                ) : backups.length === 0 ? (
                  <p className="text-gray-400">No backups yet. Create one above!</p>
                ) : (
                  <div className="space-y-3">
                    {backups.map(backup => {
                      const date = new Date(backup.createdAt);
                      const formattedDate = date.toLocaleString();
                      return (
                        <div key={backup._id} className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-white">{backup.backupName}</p>
                              <p className="text-sm text-gray-400">{formattedDate}</p>
                              {backup.description && (
                                <p className="text-sm text-gray-500 mt-1">{backup.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRestoreBackup(backup._id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm whitespace-nowrap flex items-center gap-2"
                              >
                                <Icon name="restore" className="w-5 h-5" />
                                Restore
                              </button>
                              <button
                                onClick={() => handleDeleteBackupFile(backup._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition text-sm whitespace-nowrap flex items-center gap-2"
                              >
                                <Icon name="delete" className="w-5 h-5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <p className="text-sm text-blue-300 flex items-start gap-2">
                  <Icon name="lightbulb" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Tip:</strong> Create a backup before making major changes to your content. You can restore from any backup to undo mistakes.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
