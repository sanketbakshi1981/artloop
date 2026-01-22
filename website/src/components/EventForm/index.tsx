import React, { useState, useEffect } from 'react';
import type { Event } from '../../services/eventsService';
import styles from './styles.module.css';

interface EventFormProps {
  initialData?: Event | null;
  onSave: (event: Event) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ initialData, onSave, onCancel }: EventFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<Event>({
    title: initialData?.title || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    venue: initialData?.venue || '',
    venueAddress: initialData?.venueAddress || '',
    performer: initialData?.performer || '',
    performerBio: initialData?.performerBio || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    image: initialData?.image || '',
    price: initialData?.price || '$0',
    capacity: initialData?.capacity || '50 guests',
    dresscode: initialData?.dresscode || 'Casual',
    includes: initialData?.includes || [],
    hostEmail: initialData?.hostEmail || '',
    isFree: initialData?.isFree || false,
    inviteOnly: initialData?.inviteOnly || false,
    inviteCode: initialData?.inviteCode || '',
  });

  // Update form when initialData changes (e.g., when editing a different event)
  useEffect(() => {
    setFormData({
      title: initialData?.title || '',
      date: initialData?.date || '',
      time: initialData?.time || '',
      venue: initialData?.venue || '',
      venueAddress: initialData?.venueAddress || '',
      performer: initialData?.performer || '',
      performerBio: initialData?.performerBio || '',
      description: initialData?.description || '',
      fullDescription: initialData?.fullDescription || '',
      image: initialData?.image || '',
      price: initialData?.price || '$0',
      capacity: initialData?.capacity || '50 guests',
      dresscode: initialData?.dresscode || 'Casual',
      includes: initialData?.includes || [],
      hostEmail: initialData?.hostEmail || '',
      isFree: initialData?.isFree || false,
      inviteOnly: initialData?.inviteOnly || false,
      inviteCode: initialData?.inviteCode || '',
    });
  }, [initialData]);

  const [includesInput, setIncludesInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddInclude = () => {
    if (includesInput.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includesInput.trim()]
      }));
      setIncludesInput('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.date || !formData.time || !formData.venue) {
        throw new Error('Please fill in all required fields');
      }

      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Basic Information */}
        <div className={styles.formSection}>
          <h3>Basic Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Acoustic Bollywood Night"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date *</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                placeholder="e.g., January 18, 2026"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Time *</label>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                placeholder="e.g., 7:00 PM - 10:00 PM"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="venue">Venue Name *</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="e.g., Blue Note Jazz Club"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="venueAddress">Venue Address *</label>
            <input
              type="text"
              id="venueAddress"
              name="venueAddress"
              value={formData.venueAddress}
              onChange={handleChange}
              required
              placeholder="e.g., 123 Main St, New York, NY"
            />
          </div>
        </div>

        {/* Performer Information */}
        <div className={styles.formSection}>
          <h3>Performer Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="performer">Performer Name *</label>
            <input
              type="text"
              id="performer"
              name="performer"
              value={formData.performer}
              onChange={handleChange}
              required
              placeholder="e.g., Sarah Johnson Trio"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="performerBio">Performer Bio</label>
            <textarea
              id="performerBio"
              name="performerBio"
              value={formData.performerBio}
              onChange={handleChange}
              rows={3}
              placeholder="Brief biography of the performer"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className={styles.formSection}>
          <h3>Event Details</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Brief description for event listing"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fullDescription">Full Description</label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed event description"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g., /eventimg/event.jpg or https://..."
            />
          </div>
        </div>

        {/* Pricing & Logistics */}
        <div className={styles.formSection}>
          <h3>Pricing & Logistics</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., $35 or Free"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="capacity">Capacity</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 50 guests"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dresscode">Dress Code</label>
            <input
              type="text"
              id="dresscode"
              name="dresscode"
              value={formData.dresscode}
              onChange={handleChange}
              placeholder="e.g., Smart Casual"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hostEmail">Host Email *</label>
            <input
              type="email"
              id="hostEmail"
              name="hostEmail"
              value={formData.hostEmail}
              onChange={handleChange}
              required
              placeholder="host@example.com"
            />
          </div>
        </div>

        {/* What's Included */}
        <div className={styles.formSection}>
          <h3>What's Included</h3>
          
          <div className={styles.formGroup}>
            <label>Add Items</label>
            <div className={styles.includesInput}>
              <input
                type="text"
                value={includesInput}
                onChange={(e) => setIncludesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                placeholder="e.g., Welcome drink"
              />
              <button type="button" onClick={handleAddInclude} className={styles.addButton}>
                Add
              </button>
            </div>
          </div>

          {formData.includes.length > 0 && (
            <div className={styles.includesList}>
              {formData.includes.map((item, index) => (
                <div key={index} className={styles.includeItem}>
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclude(index)}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Settings */}
        <div className={styles.formSection}>
          <h3>Event Settings</h3>
          
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
              />
              <span>Free Event</span>
            </label>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="inviteOnly"
                checked={formData.inviteOnly}
                onChange={handleChange}
              />
              <span>Invite Only</span>
            </label>
          </div>

          {formData.inviteOnly && (
            <div className={styles.formGroup}>
              <label htmlFor="inviteCode">Invite Code</label>
              <input
                type="text"
                id="inviteCode"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="e.g., MUSIC2026"
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={saving}>
          {saving ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
