import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize, Eye, Clock, Star, TrendingUp, Radio, Globe as GlobeIcon, Tv, Filter, Search, X, Loader, AlertCircle } from 'lucide-react';
import PageHero from '../components/PageHero';

interface Channel {
  id: string;
  name: string;
  network?: string;
  country: string;
  subdivision?: string;
  city?: string;
  broadcast_area: string[];
  languages: string[];
  categories: string[];
  is_nsfw: boolean;
  launched?: string;
  closed?: string;
  replaced_by?: string;
  website?: string;
  logo: string;
}

interface Stream {
  channel: string;
  url: string;
  timeshift?: string;
  http_referrer?: string;
  user_agent?: string;
  status?: string;
}

const categories = [
  { id: 'all', label: 'Toutes', icon: Star },
  { id: 'news', label: 'Actualités', icon: Radio },
  { id: 'entertainment', label: 'Divertissement', icon: Tv },
  { id: 'sports', label: 'Sports', icon: TrendingUp },
  { id: 'movies', label: 'Films', icon: Play },
  { id: 'music', label: 'Musique', icon: Volume2 },
];

export default function VideoPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch channels from IPTV API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch channels
        const channelsResponse = await fetch('https://iptv-org.github.io/api/channels.json');
        const channelsData: Channel[] = await channelsResponse.json();
        
        // Fetch streams
        const streamsResponse = await fetch('https://iptv-org.github.io/api/streams.json');
        const streamsData: Stream[] = await streamsResponse.json();
        
        // Filter out NSFW content and ensure channels have logos
        const safeChannels = channelsData
          .filter(channel => !channel.is_nsfw && channel.logo && channel.name)
          .filter(channel => streamsData.some(stream => stream.channel === channel.id))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setChannels(safeChannels);
        setStreams(streamsData);
        setFilteredChannels(safeChannels.slice(0, 50));
        
        // Extract unique countries
        const countries = Array.from(new Set(safeChannels.map(c => c.country).filter(Boolean)))
          .sort();
        setAvailableCountries(countries);
        
        console.log(`[IPTV] Loaded ${safeChannels.length} channels and ${streamsData.length} streams`);
      } catch (error) {
        console.error('[IPTV] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter channels based on category, country, and search
  useEffect(() => {
    let filtered = channels;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(channel => 
        channel.categories.some(cat => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(channel => channel.country === selectedCountry);
    }

    if (searchQuery) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.network?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChannels(filtered.slice(0, 50));
  }, [selectedCategory, selectedCountry, searchQuery, channels]);

  // Load stream for selected channel
  const loadStream = async (channel: Channel) => {
    setLoadingStream(true);
    setStreamError(null);
    setSelectedChannel(channel);
    setIsPlaying(false);
    
    try {
      // Find streams for this channel
      const channelStreams = streams.filter(s => s.channel === channel.id);
      
      if (channelStreams.length === 0) {
        setStreamError('Aucun stream disponible pour cette chaîne');
        setCurrentStream(null);
        return;
      }

      // Try to find a working stream (prioritize m3u8 streams)
      const m3u8Streams = channelStreams.filter(s => s.url.includes('.m3u8'));
      const streamToUse = m3u8Streams.length > 0 ? m3u8Streams[0] : channelStreams[0];
      
      setCurrentStream(streamToUse);
      console.log(`[IPTV] Loading stream for ${channel.name}:`, streamToUse.url);
      
    } catch (error) {
      console.error('[IPTV] Error loading stream:', error);
      setStreamError('Erreur lors du chargement du stream');
      setCurrentStream(null);
    } finally {
      setLoadingStream(false);
    }
  };

  // Video player controls
  const togglePlay = () => {
    if (!videoRef.current || !currentStream) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error('[IPTV] Playback error:', err);
        setStreamError('Impossible de lire ce stream. Le stream peut être hors ligne ou géo-bloqué.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const featuredChannels = filteredChannels.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#020002] text-white">
      <PageHero
        title="THESORIA TV"
        subtitle="Streaming Premium • Chaînes Mondiales en Direct"
        gradient="from-[#d4af37] via-[#f0e68c] to-[#d4af37]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Search & Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="luxury-glass p-6 rounded-2xl border border-[#d4af37]/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/50" />
                <input
                  type="text"
                  placeholder="Rechercher une chaîne, pays, réseau..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-[#d4af37]/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-[#d4af37] transition-colors" />
                  </button>
                )}
              </div>

              {/* Country Filter */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-black/40 border border-[#d4af37]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
              >
                <option value="all">Tous les pays</option>
                {availableCountries.slice(0, 20).map(country => (
                  <option key={country} value={country}>{country || 'Inconnu'}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#d4af37]" />
                <span className="text-gray-400">
                  {filteredChannels.length} chaînes disponibles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 text-[#d4af37]" />
                <span className="text-gray-400">
                  {availableCountries.length} pays
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-red-500 font-bold">EN DIRECT</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Channels */}
        {!searchQuery && selectedCountry === 'all' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-[#d4af37] to-[#f0e68c] bg-clip-text text-transparent">
                Chaînes Populaires
              </h2>
              <Star className="w-8 h-8 text-[#d4af37]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredChannels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => loadStream(channel)}
                  className="luxury-glass p-4 rounded-xl cursor-pointer group relative overflow-hidden border border-[#d4af37]/20"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      className="flex items-center gap-1 bg-red-500/90 px-2 py-1 rounded-full text-[10px] font-bold"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </motion.div>
                  </div>

                  <div className="relative rounded-lg overflow-hidden mb-4 bg-black/60 aspect-video flex items-center justify-center">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="max-w-full max-h-full object-contain p-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Tv className="w-16 h-16 text-[#d4af37]/30" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full bg-[#d4af37] flex items-center justify-center"
                      >
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                      </motion.div>
                    </div>
                  </div>

                  <h3 className="font-display text-xl mb-2 text-[#d4af37] truncate">
                    {channel.name}
                  </h3>
                  <div className="text-gray-400 text-sm space-y-1">
                    {channel.network && (
                      <p className="truncate">{channel.network}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {channel.country && (
                        <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] text-xs">
                          {channel.country}
                        </span>
                      )}
                      {channel.categories.slice(0, 2).map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-6 py-3 rounded-lg font-body font-medium transition-all
                  flex items-center gap-2
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black'
                    : 'luxury-glass text-[#d4af37] hover:border-[#d4af37]'
                  }
                `}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37]"
            />
          </div>
        )}

        {/* Channels Grid */}
        {!loading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] bg-clip-text text-transparent">
              {selectedCategory === 'all' 
                ? 'Toutes les Chaînes' 
                : categories.find(c => c.id === selectedCategory)?.label}
            </h2>

            {filteredChannels.length === 0 ? (
              <div className="text-center py-20">
                <Tv className="w-16 h-16 text-[#d4af37]/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucune chaîne trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredChannels.map((channel, index) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => loadStream(channel)}
                    className="luxury-glass p-3 rounded-xl cursor-pointer group relative overflow-hidden border border-[#d4af37]/10 hover:border-[#d4af37]/30"
                  >
                    <div className="relative rounded-lg overflow-hidden mb-3 bg-black/60 aspect-video flex items-center justify-center">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="max-w-full max-h-full object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Tv className="w-8 h-8 text-[#d4af37]/30" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center"
                        >
                          <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                        </motion.div>
                      </div>
                      <div className="absolute top-1 right-1">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-red-500"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>

                    <h3 className="font-display text-sm mb-1 text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {channel.name}
                    </h3>
                    {channel.country && (
                      <p className="text-gray-400 text-xs truncate">
                        {channel.country}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Channel Player Modal */}
        {selectedChannel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChannel(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl luxury-glass rounded-2xl overflow-hidden border border-[#d4af37]/30"
            >
              {/* Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {loadingStream && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
                    <div className="text-center">
                      <Loader className="w-12 h-12 text-[#d4af37] mx-auto mb-4 animate-spin" />
                      <p className="text-[#d4af37] text-sm">Chargement du stream...</p>
                    </div>
                  </div>
                )}

                {streamError && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/90">
                    <div className="text-center max-w-md px-6">
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <p className="text-red-400 mb-2 font-bold">Erreur de lecture</p>
                      <p className="text-gray-400 text-sm">{streamError}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setStreamError(null);
                          if (selectedChannel) loadStream(selectedChannel);
                        }}
                        className="mt-4 px-6 py-2 bg-[#d4af37] text-black rounded-lg font-bold"
                      >
                        Réessayer
                      </motion.button>
                    </div>
                  </div>
                )}

                {currentStream && !loadingStream && !streamError ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls={false}
                    autoPlay={false}
                    muted={isMuted}
                    onError={(e) => {
                      console.error('[IPTV] Video error:', e);
                      setStreamError('Impossible de charger cette vidéo. Le stream peut être hors ligne ou géo-bloqué.');
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={currentStream.url} type="application/x-mpegURL" />
                    <source src={currentStream.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                ) : !loadingStream && !streamError && (
                  <>
                    {selectedChannel.logo ? (
                      <img
                        src={selectedChannel.logo}
                        alt={selectedChannel.name}
                        className="max-w-[50%] max-h-[50%] object-contain"
                      />
                    ) : (
                      <Tv className="w-32 h-32 text-[#d4af37]/30" />
                    )}
                  </>
                )}
                
                {/* Live Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <motion.div
                    className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full text-sm font-bold"
                    animate={{ opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                    EN DIRECT
                  </motion.div>
                </div>

                {/* Player Controls Overlay */}
                {currentStream && !loadingStream && !streamError && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-[#d4af37] flex items-center justify-center shadow-2xl"
                      >
                        {isPlaying ? (
                          <Pause className="w-10 h-10 text-black" fill="currentColor" />
                        ) : (
                          <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
                        )}
                      </motion.button>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMute}
                            className="text-white hover:text-[#d4af37] transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </motion.button>

                          <span className="text-white font-mono text-sm">
                            ● LIVE
                          </span>
                          
                          {currentStream.url.includes('.m3u8') && (
                            <span className="text-[#d4af37] text-xs px-2 py-1 bg-[#d4af37]/20 rounded">
                              HLS
                            </span>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleFullscreen}
                          className="text-white hover:text-[#d4af37] transition-colors"
                        >
                          <Maximize className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Channel Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-2xl mb-2 text-[#d4af37]">
                      {selectedChannel.name}
                    </h3>
                    {selectedChannel.network && (
                      <p className="text-gray-400 mb-2">
                        Réseau: {selectedChannel.network}
                      </p>
                    )}
                  </div>
                  {selectedChannel.logo && (
                    <img
                      src={selectedChannel.logo}
                      alt={selectedChannel.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {selectedChannel.country && (
                    <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-sm font-medium">
                      🌍 {selectedChannel.country}
                    </span>
                  )}
                  {selectedChannel.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                      🗣️ {lang}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedChannel.categories.map((cat, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-black/40 border border-[#d4af37]/20 text-gray-300 text-xs">
                      {cat}
                    </span>
                  ))}
                </div>

                {selectedChannel.website && (
                  <a
                    href={selectedChannel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-[#d4af37] hover:text-[#f0e68c] transition-colors text-sm"
                  >
                    <GlobeIcon className="w-4 h-4" />
                    Site web officiel
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 luxury-glass p-8 rounded-2xl border border-[#d4af37]/20"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-[#d4af37] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-display font-bold text-[#d4af37] mb-3">
                À propos de THESORIA TV
              </h3>
              <div className="text-gray-400 space-y-2 text-sm">
                <p>
                  THESORIA TV vous donne accès à des milliers de chaînes de télévision en direct du monde entier via l'API IPTV-ORG.
                </p>
                <p>
                  <strong className="text-[#d4af37]">Note importante :</strong> Certains streams peuvent être hors ligne, géo-bloqués ou nécessiter des plugins spécifiques (comme HLS.js pour les streams m3u8). 
                  Les navigateurs modernes supportent nativement de nombreux formats, mais la disponibilité des chaînes dépend de sources tierces.
                </p>
                <p>
                  Données fournies par <a href="https://iptv-org.github.io/" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#f0e68c] underline">IPTV-ORG</a> • 
                  Mise à jour en temps réel • Filtrage automatique du contenu inapproprié
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}