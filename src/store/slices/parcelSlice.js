export const createParcelSlice = (set, get) => ({
  parcelsGeoJson: null,
  utilitiesGeoJson: null,
  selectedUlpin: null,
  selectedFeature: null,
  
  // 3-Layer GIS Architecture
  // 'base': Georeferenced Cadastral Boundaries & ULPIN Mesh
  // 'essential': RoR Ownership, Deeds & Master Plan Zoning
  // 'usecase': Utilities, Property Tax & Eco-Buffers
  gisTier: 'base', // 'base' | 'essential' | 'usecase'
  activeSubLayer: 'cadastral', // 'cadastral' | 'zoning' | 'taxation' | 'encumbrance' | 'utilities'
  
  // Official DoLR Pilot Filter & Rural vs Urban Context
  pilotFilter: 'all', // 'all' | 'chandigarh' | 'tamilnadu' | 'panindia'
  cadastreContext: 'all', // 'all' | 'rural' | 'urban'

  showUtilitiesOverlay: true,
  hoveredUlpin: null,
  flyToTarget: null, // { bounds } or { lat, lng, zoom }
  isDetailOpen: false,
  currentLanguage: 'en', // 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'pa' | 'gu' | 'bn'

  setLanguage: (lang) => set({ currentLanguage: lang }),
  setParcelsGeoJson: (data) => set({ parcelsGeoJson: data }),
  setUtilitiesGeoJson: (data) => set({ utilitiesGeoJson: data }),

  setSelectedUlpin: (ulpin) => {
    if (!ulpin) {
      set({ selectedUlpin: null, selectedFeature: null, isDetailOpen: false });
      return;
    }

    const { parcelsGeoJson } = get();
    let match = null;
    if (parcelsGeoJson?.features) {
      match = parcelsGeoJson.features.find(
        (f) => String(f.properties?.ulpin) === String(ulpin)
      );
    }

    set({
      selectedUlpin: ulpin,
      selectedFeature: match || null,
      isDetailOpen: true,
    });
  },

  setGisTier: (tier) => {
    let defaultSub = 'cadastral';
    let showUtils = false;
    if (tier === 'essential') {
      defaultSub = 'zoning';
    } else if (tier === 'usecase') {
      defaultSub = 'taxation';
      showUtils = true;
    }
    set({
      gisTier: tier,
      activeSubLayer: defaultSub,
      showUtilitiesOverlay: showUtils,
    });
  },

  setActiveSubLayer: (sub) => set({ activeSubLayer: sub }),
  toggleUtilitiesOverlay: () => set((state) => ({ showUtilitiesOverlay: !state.showUtilitiesOverlay })),

  setPilotFilter: (filter) => set({ pilotFilter: filter }),
  setCadastreContext: (context) => set({ cadastreContext: context }),

  setHoveredUlpin: (ulpin) => set({ hoveredUlpin: ulpin }),
  setFlyToTarget: (target) => set({ flyToTarget: target }),
  closeDetailPanel: () => set({ isDetailOpen: false }),
  openDetailPanel: () => set({ isDetailOpen: true }),
});
