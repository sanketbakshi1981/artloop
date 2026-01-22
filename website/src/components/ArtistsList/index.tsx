import React from 'react';
import type { Artist } from '../../services/artistsService';
import styles from './styles.module.css';

interface ArtistsListProps {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

export default function ArtistsList({ artists, onEdit, onDelete }: ArtistsListProps): React.JSX.Element {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Talents</th>
            <th>Rating</th>
            <th>Featured</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td className={styles.idCell}>{artist.id}</td>
              <td>
                <div className={styles.artistInfo}>
                  {artist.profileImage && (
                    <img 
                      src={artist.profileImage} 
                      alt={artist.name} 
                      className={styles.thumbnail}
                    />
                  )}
                  <div>
                    <strong>{artist.name}</strong>
                    <small>{artist.bio?.substring(0, 60)}...</small>
                  </div>
                </div>
              </td>
              <td>{artist.location}</td>
              <td>
                <div className={styles.talents}>
                  {artist.talents?.slice(0, 3).map((talent, i) => (
                    <span key={i} className={styles.talent}>{talent}</span>
                  ))}
                  {artist.talents?.length > 3 && (
                    <span className={styles.moreTalents}>+{artist.talents.length - 3}</span>
                  )}
                </div>
              </td>
              <td>
                <span className={styles.rating}>
                  ⭐ {artist.rating?.toFixed(1) || 'N/A'}
                  <small>({artist.totalReviews || 0})</small>
                </span>
              </td>
              <td>
                {artist.featured ? (
                  <span className={styles.featuredBadge}>⭐ Featured</span>
                ) : (
                  <span className={styles.notFeatured}>-</span>
                )}
              </td>
              <td>
                <span className={`${styles.status} ${styles[artist.status || 'active']}`}>
                  {artist.status || 'active'}
                </span>
              </td>
              <td className={styles.actions}>
                <button 
                  onClick={() => onEdit(artist)} 
                  className={styles.editButton}
                  title="Edit artist"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDelete(artist.id!)} 
                  className={styles.deleteButton}
                  title="Delete artist"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
