import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/client';
import { toast } from 'react-hot-toast';
import type { Group } from '../types/app';

const SELECTED_GROUP_KEY = 'selected_group_id';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupIdState] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_GROUP_KEY);
  });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/me/groups');
      const nextGroups = data.data || [];
      setGroups(nextGroups);
      setSelectedGroupIdState((current) => {
        const isValid = current && nextGroups.some((group: Group) => group.id === current);
        const nextSelected = isValid ? current : nextGroups[0]?.id ?? null;
        if (nextSelected) {
          localStorage.setItem(SELECTED_GROUP_KEY, nextSelected);
        } else {
          localStorage.removeItem(SELECTED_GROUP_KEY);
        }
        return nextSelected;
      });
    } catch (err: any) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const setSelectedGroupId = (groupId: string) => {
    localStorage.setItem(SELECTED_GROUP_KEY, groupId);
    setSelectedGroupIdState(groupId);
  };

  const createGroup = async (groupData: Pick<Group, 'name' | 'type' | 'description'>) => {
    try {
      const { data } = await api.post('/groups', groupData);
      setGroups(prev => [data.data, ...prev]);
      setSelectedGroupId(data.data.id);
      toast.success('Group created successfully!');
      return data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create group');
      return null;
    }
  };

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null,
    [groups, selectedGroupId]
  );

  return { groups, loading, fetchGroups, createGroup, selectedGroup, selectedGroupId, setSelectedGroupId };
};
