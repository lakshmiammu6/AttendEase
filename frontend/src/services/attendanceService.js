import api from './api';

export const attendanceService = {
  // Get subjects and sections assigned to the logged-in faculty
  async getAssignments() {
    const response = await api.get('/attendance/assignments');
    return response.data;
  },

  // Get students in a selected section
  async getStudents(sectionId) {
    const response = await api.get(`/attendance/students/${sectionId}`);
    return response.data;
  },

  // Save attendance
  async markAttendance(data) {
    const response = await api.post('/attendance/mark', data);
    return response.data;
  }
};
