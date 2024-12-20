// src/components/Select/Select.tsx
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../api/interfaces';
import { fetchUsers } from '../../api/api';
import styles from './Select.module.css';
import arrowIcon from '../../assets/arrow-icon.png';

const Select: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Пользователи
  const [page, setPage] = useState<number>(1); // Текущая страница
  const [isOpen, setIsOpen] = useState<boolean>(false); // Состояние выпадающего списка
  const [isLoading, setIsLoading] = useState<boolean>(false); // Состояние загрузки
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Выбранный пользователь
  const listRef = useRef<HTMLDivElement | null>(null); // Ссылка на список

  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        setIsLoading(true);
        const newUsers = await fetchUsers(page);
        setUsers((prev) => [...prev, ...newUsers]);
        setIsLoading(false);
      };

      loadUsers();
    }
  }, [page, isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    setIsOpen(false);
  };

  console.log(isOpen, '00');
  

  return (
    <>
      <div className={styles.header}>Users</div>
    <div className={styles.selectContainer}>
      <div
        className={`${styles.selectHeader} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={selectedUser ? { border: '2px solid #4971FF' } : {}}
      >
        <span>{selectedUser ? `${selectedUser.last_name} ${selectedUser.first_name}${selectedUser.job ? `, ${selectedUser.job}` : ''}` : 'Select a user'}</span>
        <img
          src={arrowIcon}
          alt="arrow"
          className={styles.arrowIcon}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {/* Список пользователей */}
      {isOpen && (
        <div className={styles.selectList} onScroll={handleScroll} ref={listRef}>
          {users.map((user) => (
            <div
              key={user.id}
              className={styles.selectItem}
              onClick={() => handleSelect(user)}
              style={
                selectedUser?.id === user.id
                  ? { border: '2px solid #4971FF' }
                  : {}
              }
            >
              <div className={styles.userCircle}>{user.last_name.charAt(0)}</div>
              {user.last_name} {user.first_name}{user.job ? `, ${user.job}` : ''}
            </div>
          ))}
          {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}
        </div>
      )}
    </div>
    </>
  );
};

export default Select;
