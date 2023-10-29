import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
  state: {
    studentCount: 0,
    students: [],
    theme: 'light-theme', // За замовчуванням світла тема
  },
  mutations: {
    setStudentCount(state, count) {
      state.studentCount = count;
    },
    updateStudent(state, { index, student }) {
      state.students[index] = student;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
  },
  getters: {
    theme: (state) => state.theme,
  },
  actions: {
    updateStudentCount({ commit }, count) {
      commit('setStudentCount', count);
    },
    setAppTheme({ commit }, theme) {
      commit('setTheme', theme);
    },
    // Додати функцію для збереження студента
    saveStudent({ commit, state }, updatedStudent) {
      return new Promise((resolve, reject) => {
        // Виконати запит на сервер для оновлення студента
        axios.put(`${apiBaseUrl}/students/${updatedStudent._id}`, updatedStudent)
          .then((response) => {
            // Оновити локальні дані у сховищі
            const index = state.students.findIndex((student) => student._id === updatedStudent._id);
            if (index !== -1) {
              commit('updateStudent', { index, student: response.data });
            }

            // Оновити лічильник studentCount
            commit('setStudentCount', state.students.length);

            // Викликати resolve
            resolve(response.data);
          })
          .catch((error) => {
            // Викликати reject у разі помилки
            reject(error);
          });
      });
    },
  },
});
