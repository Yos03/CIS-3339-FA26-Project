import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { loginUser, logoutUser } from '../api/api';
import jwt_decode from 'jwt-decode';

const toast = useToast();

export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => ({
    name: '',
    role: '',
    isLoggedIn: false,
    sessionRestored: false
  }),
  actions: {
    initializeSession() {
      if (this.sessionRestored) return;
      this.sessionRestored = true;
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const decodedToken = jwt_decode(token);
        if (!decodedToken || !decodedToken.role) {
          logoutUser();
          return;
        }
        this.$patch({
          isLoggedIn: true,
          role: decodedToken.role,
          name: decodedToken.name || ''
        });
      } catch {
        logoutUser();
        this.$patch({ name: '', role: '', isLoggedIn: false });
      }
    },
    async login(username, password) {
      try {
        const token = await loginUser(username, password);
        const decodedToken = jwt_decode(token);
        this.$patch({
          isLoggedIn: true,
          role: decodedToken.role,
          name: decodedToken.name || '',
          sessionRestored: true
        });
        const redirect = this.$router.currentRoute.value.query.redirect;
        this.$router.push(typeof redirect === 'string' ? redirect : '/');
        toast.success('Login successful!');
      } catch (error) {
        toast.error(error?.message || 'Unable to log in.');
      }
    },
    logout() {
      logoutUser();
      this.$patch({ name: '', role: '', isLoggedIn: false, sessionRestored: true });
      this.$router.push('/');
      toast.info('You have been logged out!');
    }
  }
});
