import styles from './Card.module.css';

export default function Card({ title, children, footer, onClick, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`} onClick={onClick}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
