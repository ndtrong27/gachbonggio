import { Metadata } from 'next';
import AiAgentManagerClient from './AiAgentManagerClient';

export const metadata: Metadata = {
  title: 'Đào Tạo & Đánh Giá AI Agent | Quản Trị Vĩnh Cửu Sài Gòn',
  description: 'Hệ thống đánh giá câu trả lời thực tế của chatbot và cập nhật tri thức động vào System Message của AI Agent trên n8n.',
};

export const revalidate = 0; // Fresh admin data

export default function AdminAiAgentPage() {
  return <AiAgentManagerClient />;
}
