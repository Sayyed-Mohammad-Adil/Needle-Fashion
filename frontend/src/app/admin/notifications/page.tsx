'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAdminNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  Notification
} from '@/lib/api/notification.service';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const [formData, setFormData] = useState<Omit<Notification, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'readBy' | 'isRead'>>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    targetUsers: 'all',
    userIds: [],
    expiresAt: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAdminNotifications(currentPage, 10);
      setNotifications(data.notifications);
      setTotalPages(data.pages);
      setTotalNotifications(data.total);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNotification) {
        // Update existing notification
        await updateNotification(editingNotification._id!, formData);
        toast.success('Notification updated successfully');
      } else {
        // Create new notification
        await createNotification(formData);
        toast.success('Notification created successfully');
      }

      // Reset form and refresh notifications
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        targetUsers: 'all',
        userIds: [],
        expiresAt: '',
      });
      setEditingNotification(null);
      setIsCreating(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error('Failed to save notification');
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      targetUsers: notification.targetUsers,
      userIds: notification.userIds || [],
      expiresAt: notification.expiresAt || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await deleteNotification(id);
      toast.success('Notification deleted successfully');
      fetchNotifications();

      // If we were editing this notification, reset the form
      if (editingNotification?._id === id) {
        setEditingNotification(null);
        setIsCreating(false);
        setFormData({
          title: '',
          message: '',
          type: 'info',
          priority: 'medium',
          targetUsers: 'all',
          userIds: [],
          expiresAt: '',
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      targetUsers: 'all',
      userIds: [],
      expiresAt: '',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Notification Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create New Notification
        </button>
      </div>

      {isCreating || editingNotification ? (
        <div className="bg-card border border-border shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            {editingNotification ? 'Edit Notification' : 'Create New Notification'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetUsers" className="block text-sm font-medium text-foreground mb-1">
                  Target Users
                </label>
                <select
                  id="targetUsers"
                  value={formData.targetUsers}
                  onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value as any })}
                  className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Users</option>
                  <option value="specific">Specific Users</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>

              {formData.targetUsers === 'specific' && (
                <div className="md:col-span-2">
                  <label htmlFor="userIds" className="block text-sm font-medium text-foreground mb-1">
                    User IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    id="userIds"
                    value={formData.userIds?.join(', ') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      userIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
                    })}
                    className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                    placeholder="Enter user IDs separated by commas"
                  />
                </div>
              )}

              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-foreground mb-1">
                  Expires At
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border bg-background border-border text-foreground focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-border rounded-md text-foreground bg-background hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {editingNotification ? 'Update Notification' : 'Create Notification'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-card border border-border shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Existing Notifications</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notifications found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Target
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {notifications.map((notification) => (
                    <tr key={notification._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{notification.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{notification.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-800' :
                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              notification.type === 'error' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                          }`}>
                          {notification.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {notification.targetUsers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(notification.createdAt || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(notification)}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(notification._id!)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-foreground">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                              ? 'z-10 bg-primary border-primary text-primary-foreground'
                              : 'bg-background border-border text-muted-foreground hover:bg-muted'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}