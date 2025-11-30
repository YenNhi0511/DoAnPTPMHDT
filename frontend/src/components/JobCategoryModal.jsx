import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { jobCategories, getJobGroups, getProfessionsByGroup, getPositionsByProfession, searchCategories } from '../data/job-categories';

const JobCategoryModal = ({ isOpen, onClose, onSelect, selectedCategories = [] }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState(new Set(selectedCategories));

  useEffect(() => {
    if (isOpen) {
      setSelectedPositions(new Set(selectedCategories));
    }
  }, [isOpen, selectedCategories]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedProfession(null);
  };

  const handleProfessionSelect = (profession) => {
    setSelectedProfession(profession);
  };

  const handlePositionToggle = (position) => {
    const newSelected = new Set(selectedPositions);
    if (newSelected.has(position)) {
      newSelected.delete(position);
    } else {
      newSelected.add(position);
    }
    setSelectedPositions(newSelected);
  };

  const handleSelect = () => {
    onSelect(Array.from(selectedPositions));
    onClose();
  };

  const handleDeselectAll = () => {
    setSelectedPositions(new Set());
  };

  // Search results
  const searchResults = searchKeyword ? searchCategories(searchKeyword) : null;

  // Get data to display
  const groups = getJobGroups();
  const professions = selectedGroup ? getProfessionsByGroup(selectedGroup) : [];
  const positions = selectedGroup && selectedProfession 
    ? getPositionsByProfession(selectedGroup, selectedProfession) 
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Chọn Nhóm nghề, Nghề hoặc Chuyên môn</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-600 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm"
              className="input pl-11 w-full"
            />
          </div>
        </div>

        {/* Content - 3 Columns */}
        <div className="flex-1 overflow-hidden flex">
          {/* Column 1: NHÓM NGHỀ */}
          <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
            <div className="p-4 bg-slate-800/50">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">NHÓM NGHỀ</h3>
            </div>
            <div className="p-2">
              {searchKeyword && searchResults ? (
                <div className="space-y-1">
                  {searchResults.groups.map((group) => (
                    <button
                      key={group}
                      onClick={() => {
                        handleGroupSelect(group);
                        setSearchKeyword('');
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedGroup === group
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'hover:bg-slate-700/50 text-gray-300'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {groups.map((group) => (
                    <button
                      key={group}
                      onClick={() => handleGroupSelect(group)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedGroup === group
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'hover:bg-slate-700/50 text-gray-300'
                      }`}
                    >
                      <span>{group}</span>
                      {selectedGroup === group && (
                        <span className="text-blue-400">→</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: NGHỀ */}
          <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
            <div className="p-4 bg-slate-800/50">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">NGHỀ</h3>
            </div>
            <div className="p-2">
              {selectedGroup ? (
                <div className="space-y-1">
                  {professions.map((profession) => (
                    <button
                      key={profession.name}
                      onClick={() => handleProfessionSelect(profession.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedProfession === profession.name
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'hover:bg-slate-700/50 text-gray-300'
                      }`}
                    >
                      <span>{profession.name}</span>
                      {selectedProfession === profession.name && (
                        <span className="text-blue-400">→</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700">
                  <div className="text-center">
                    <p className="text-sm">Vui lòng chọn Nhóm nghề</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: VỊ TRÍ CHUYÊN MÔN */}
          <div className="w-1/3 overflow-y-auto">
            <div className="p-4 bg-slate-800/50">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">VỊ TRÍ CHUYÊN MÔN</h3>
            </div>
            <div className="p-2">
              {selectedGroup && selectedProfession ? (
                <div className="space-y-1">
                  {positions.map((position) => (
                    <label
                      key={position}
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPositions.has(position)
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPositions.has(position)}
                        onChange={() => handlePositionToggle(position)}
                        className="w-4 h-4 text-blue-500 rounded border-slate-600 focus:ring-blue-500"
                      />
                      <span className={`flex-1 ${selectedPositions.has(position) ? 'text-blue-400' : 'text-gray-300'}`}>
                        {position}
                      </span>
                      {selectedPositions.has(position) && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700">
                  <div className="text-center">
                    <p className="text-sm">Vui lòng chọn Nghề</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-600 hover:text-white transition-colors"
            >
              Bỏ chọn tất cả
            </button>
            <span className="text-sm text-gray-700">
              Đã chọn: {selectedPositions.size}
            </span>
            {selectedPositions.size > 0 && (
              <button
                onClick={handleDeselectAll}
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Hủy các mục đã chọn
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSelect}
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategoryModal;

