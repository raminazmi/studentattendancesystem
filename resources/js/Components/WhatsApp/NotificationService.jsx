import axios from 'axios';

export class NotificationService {
  static async sendWhatsAppNotification(studentId, status, message) {
    try {
      const response = await axios.post('/api/notifications/whatsapp', {
        studentId,
        status,
        message
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send WhatsApp notification');
    }
  }

  static getStatusMessage(status, studentName, date, language = 'en') {
    const messages = {
      en: {
        absent: `Dear parent, ${studentName} was absent from school on ${date}.`,
        late: `Dear parent, ${studentName} arrived late to school on ${date}.`
      },
      ar: {
        absent: `عزيزي ولي الأمر، ${studentName} كان غائباً عن المدرسة يوم ${date}.`,
        late: `عزيزي ولي الأمر، ${studentName} وصل متأخراً إلى المدرسة يوم ${date}.`
      }
    };
    return messages[language][status] || '';
  }
}