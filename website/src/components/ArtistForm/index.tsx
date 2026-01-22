import React, { useState, useEffect } from 'react';
import type { Artist } from '../../services/artistsService';
import styles from './styles.module.css';

interface ArtistFormProps {
  initialData?: Artist | null;
  onSave: (artist: Artist) => Promise<void>;
  onCancel: () => void;
}

export default function ArtistForm({ initialData, onSave, onCancel }: ArtistFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<Artist>({
    name: initialData?.name || '',
    profileImage: initialData?.profileImage || '',
    talents: initialData?.talents || [],
    bio: initialData?.bio || '',
    fullBio: initialData?.fullBio || '',
    location: initialData?.location || '',
    rating: initialData?.rating || 0,
    totalReviews: initialData?.totalReviews || 0,
    priceRange: initialData?.priceRange || '',
    availability: initialData?.availability || '',
    socialLinks: initialData?.socialLinks || {},
    featured: initialData?.featured || false,
  });

  // Update form when initialData changes (e.g., when editing a different artist)
  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      profileImage: initialData?.profileImage || '',
      talents: initialData?.talents || [],
      bio: initialData?.bio || '',
      fullBio: initialData?.fullBio || '',
      location: initialData?.location || '',
      rating: initialData?.rating || 0,
      totalReviews: initialData?.totalReviews || 0,
      priceRange: initialData?.priceRange || '',
      availability: initialData?.availability || '',
      socialLinks: initialData?.socialLinks || {},
      featured: initialData?.featured || false,
    });
  }, [initialData]);

  const [talentInput, setTalentInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAddTalent = () => {
    if (talentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        talents: [...prev.talents, talentInput.trim()]
      }));
      setTalentInput('');
    }
  };

  const handleRemoveTalent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      talents: prev.talents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.bio || !formData.location) {
        throw new Error('Please fill in all required fields (Name, Bio, Location)');
      }

      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to save artist');
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
            <label htmlFor="name">Artist/Band Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Vikram Kumar"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New Jersey, USA"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="profileImage">Profile Image URL</label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Artist
            </label>
          </div>
        </div>

        {/* Bio */}
        <div className={styles.formSection}>
          <h3>Biography</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="bio">Short Bio *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description (1-2 sentences)"
              rows={2}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fullBio">Full Biography</label>
            <textarea
              id="fullBio"
              name="fullBio"
              value={formData.fullBio}
              onChange={handleChange}
              placeholder="Complete biography..."
              rows={5}
            />
          </div>
        </div>

        {/* Talents */}
        <div className={styles.formSection}>
          <h3>Talents & Skills</h3>
          
          <div className={styles.formGroup}>
            <label>Talents</label>
            <div className={styles.includesWrapper}>
              <input
                type="text"
                value={talentInput}
                onChange={(e) => setTalentInput(e.target.value)}
                placeholder="Add a talent..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTalent())}
              />
              <button type="button" onClick={handleAddTalent} className={styles.addButton}>
                Add
              </button>
            </div>
            <div className={styles.includesList}>
              {formData.talents.map((talent, index) => (
                <span key={index} className={styles.includeItem}>
                  {talent}
                  <button type="button" onClick={() => handleRemoveTalent(index)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className={styles.formSection}>
          <h3>Pricing & Availability</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="priceRange">Price Range</label>
            <input
              type="text"
              id="priceRange"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              placeholder="e.g., $200 - $500"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="availability">Availability</label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Weekends, Friday evenings"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="rating">Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="totalReviews">Total Reviews</label>
              <input
                type="number"
                id="totalReviews"
                name="totalReviews"
                value={formData.totalReviews}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.formSection}>
          <h3>Social Links</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="instagram">Instagram URL</label>
            <input
              type="text"
              id="instagram"
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="youtube">YouTube URL</label>
            <input
              type="text"
              id="youtube"
              value={formData.socialLinks?.youtube || ''}
              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="spotify">Spotify URL</label>
            <input
              type="text"
              id="spotify"
              value={formData.socialLinks?.spotify || ''}
              onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
              placeholder="https://open.spotify.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="website">Website URL</label>
            <input
              type="text"
              id="website"
              value={formData.socialLinks?.website || ''}
              onChange={(e) => handleSocialLinkChange('website', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={styles.submitButton}>
          {saving ? 'Saving...' : (initialData?.id ? 'Update Artist' : 'Create Artist')}
        </button>
      </div>
    </form>
  );
}
