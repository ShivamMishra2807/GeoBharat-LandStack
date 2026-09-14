export const DEMO_CITIZEN_A = {
  id: 'CIT-001',
  name: 'Ramesh Dnyandev Patil',
  role: 'citizen',
  email: 'ramesh.patil@example.in',
  phone: '+91 98220 44102',
  state: 'Maharashtra',
  district: 'Pune',
  taluka: 'Haveli',
  village: 'Wagholi',
  ulpin_associated: '27250010045001',
};

export const DEMO_CITIZEN_B = {
  id: 'CIT-002',
  name: 'Sunita Suresh Gaikwad',
  role: 'citizen',
  email: 'sunita.gaikwad@example.in',
  phone: '+91 98231 55900',
  state: 'Maharashtra',
  district: 'Pune',
  taluka: 'Haveli',
  village: 'Wagholi',
  ulpin_associated: '27250010045002',
};

export const DEMO_ADMIN = {
  id: 'ADMIN-001',
  name: 'Dr. Vikramaditya Shinde, IAS',
  username: 'admin',
  role: 'admin',
  designation: 'Sub-Divisional Officer (SDO) / Prant Officer',
  department: 'Department of Revenue & Land Records',
  jurisdiction: 'Haveli & Pune Metropolitan Region',
  email: 'admin@geobharat.gov.in',
};

export const DEFAULT_CITIZEN = DEMO_CITIZEN_A;
export const DEFAULT_OFFICIAL = DEMO_ADMIN;

// Always start unauthenticated when the app is opened so the user sees the outer landing page and login/signup options
const getInitialAuth = () => {
  try {
    localStorage.removeItem('geobharat_token');
    localStorage.removeItem('geobharat_current_user');
    sessionStorage.removeItem('geobharat_token');
    sessionStorage.removeItem('geobharat_current_user');
  } catch (e) {}

  return {
    user: null,
    role: null,
    isAuthenticated: false,
  };
};

const initial = getInitialAuth();

export const createAuthSlice = (set) => ({
  user: initial.user,
  role: initial.role, // 'citizen' | 'admin'
  isAuthenticated: initial.isAuthenticated,

  setAuthUser: (user, token) => {
    if (token) localStorage.setItem('geobharat_token', token);
    if (user) localStorage.setItem('geobharat_current_user', JSON.stringify(user));
    set({
      user,
      role: user?.role || 'citizen',
      isAuthenticated: !!user,
    });
  },

  login: (role = 'citizen', customUser = null) => {
    let selectedUser = customUser;
    if (!selectedUser) {
      if (role === 'admin' || role === 'official') {
        selectedUser = DEMO_ADMIN;
      } else {
        selectedUser = DEMO_CITIZEN_A;
      }
    }
    localStorage.setItem('geobharat_current_user', JSON.stringify(selectedUser));
    localStorage.setItem('geobharat_token', `token-${Date.now()}`);
    set({
      user: selectedUser,
      role: selectedUser.role,
      isAuthenticated: true,
    });
  },

  switchRole: (role) => {
    const selectedUser = (role === 'admin' || role === 'official') ? DEMO_ADMIN : DEMO_CITIZEN_A;
    localStorage.setItem('geobharat_current_user', JSON.stringify(selectedUser));
    set({
      user: selectedUser,
      role: selectedUser.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('geobharat_token');
    localStorage.removeItem('geobharat_current_user');
    sessionStorage.removeItem('geobharat_token');
    sessionStorage.removeItem('geobharat_current_user');
    set({
      user: null,
      role: null,
      isAuthenticated: false,
    });
  },
});
