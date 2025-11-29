import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, ChevronDown, Search, Check } from 'lucide-react';
import { vietnamLocations, getProvinces, getDistrictsByProvince } from '../data/vietnam-locations';

const LocationSelector = ({ selectedProvince, selectedDistrict, onChange, placeholder = "Chọn tỉnh/thành phố" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const buttonRef = useRef(null);
  const [searchProvince, setSearchProvince] = useState('');
  const [tempProvinces, setTempProvinces] = useState(selectedProvince ? [selectedProvince] : []);
  const [tempDistricts, setTempDistricts] = useState(
    selectedProvince && selectedDistrict 
      ? { [selectedProvince]: [selectedDistrict] }
      : {}
  );

  const provinces = getProvinces();
  const filteredProvinces = searchProvince
    ? provinces.filter(p => p.toLowerCase().includes(searchProvince.toLowerCase()))
    : provinces;

  const handleProvinceToggle = (province) => {
    setTempProvinces(prev => {
      if (prev.includes(province)) {
        // Remove province and its districts
        const newDistricts = { ...tempDistricts };
        delete newDistricts[province];
        setTempDistricts(newDistricts);
        return prev.filter(p => p !== province);
      } else {
        return [...prev, province];
      }
    });
  };

  const handleDistrictToggle = (province: string, district: string) => {
    setTempDistricts(prev => {
      const provinceDistricts = prev[province] || [];
      if (provinceDistricts.includes(district)) {
        return {
          ...prev,
          [province]: provinceDistricts.filter(d => d !== district)
        };
      } else {
        return {
          ...prev,
          [province]: [...provinceDistricts, district]
        };
      }
    });
  };

  const handleSelectAllDistricts = (province: string) => {
    const districts = getDistrictsByProvince(province);
    setTempDistricts(prev => ({
      ...prev,
      [province]: districts
    }));
  };

  const handleDeselectAllDistricts = (province: string) => {
    setTempDistricts(prev => {
      const newDistricts = { ...prev };
      delete newDistricts[province];
      return newDistricts;
    });
  };

  const handleDeselectAll = () => {
    setTempProvinces([]);
    setTempDistricts({});
  };

  const handleApply = () => {
    // Convert to format: province or "province - district"
    if (tempProvinces.length === 0) {
      onChange({ province: '', district: '' });
    } else if (tempProvinces.length === 1) {
      const province = tempProvinces[0];
      const districts = tempDistricts[province] || [];
      if (districts.length === 0) {
        onChange({ province, district: '' });
      } else if (districts.length === 1) {
        onChange({ province, district: districts[0] });
      } else {
        // Multiple districts - use first one or combine
        onChange({ province, district: districts[0] });
      }
    } else {
      // Multiple provinces - use first one
      onChange({ province: tempProvinces[0], district: '' });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempProvinces([]);
    setTempDistricts({});
    onChange({ province: '', district: '' });
    setIsOpen(false);
  };

  // Get all selected districts for display
  const allSelectedDistricts = Object.values(tempDistricts).flat();
  const displayText = tempProvinces.length > 0
    ? tempProvinces.length === 1 && allSelectedDistricts.length > 0
      ? `${tempProvinces[0]} - ${allSelectedDistricts.length} quận/huyện`
      : tempProvinces.length === 1
      ? tempProvinces[0]
      : `${tempProvinces.length} tỉnh/thành phố`
    : placeholder;

  // Calculate popup position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupStyle({
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        minWidth: '600px',
        maxWidth: '90vw'
      });
    }
  }, [isOpen]);

  return (
    <div className="relative z-[9999]">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className={`truncate ${tempProvinces.length > 0 ? 'text-white' : 'text-gray-400'}`}>
            {displayText}
          </span>
          {tempProvinces.length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
              {tempProvinces.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {tempProvinces.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed bg-slate-900 rounded-lg shadow-2xl border-2 border-slate-600 z-[9999] max-h-[600px] overflow-hidden flex flex-col"
            style={popupStyle}
          >
            {/* Header with Search */}
            <div className="p-4 border-b border-slate-600 bg-slate-800/50">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchProvince}
                  onChange={(e) => setSearchProvince(e.target.value)}
                  placeholder="Nhập Tỉnh/Thành phố"
                  className="input pl-10 w-full text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Bỏ chọn tất cả
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - 2 Columns */}
            <div className="flex flex-1 overflow-hidden">
              {/* Column 1: Tỉnh/Thành phố */}
              <div className="w-1/2 border-r border-slate-600 overflow-y-auto bg-slate-800/30">
                <div className="p-3 bg-slate-700/50 border-b border-slate-600">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase">Tỉnh/Thành phố</h3>
                </div>
                <div className="p-2">
                  {filteredProvinces.map((province) => {
                    const isSelected = tempProvinces.includes(province);
                    const districts = getDistrictsByProvince(province);
                    const selectedDistricts = tempDistricts[province] || [];
                    const allDistrictsSelected = districts.length > 0 && selectedDistricts.length === districts.length;
                    
                    return (
                      <div key={province} className="mb-1">
                        <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-blue-600/30 hover:bg-blue-600/40' 
                            : 'hover:bg-slate-700/50'
                        }`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleProvinceToggle(province)}
                            className="w-4 h-4 text-blue-500 rounded border-slate-600 focus:ring-blue-500"
                          />
                          <span className={`flex-1 text-sm ${isSelected ? 'text-white font-semibold' : 'text-gray-200'}`}>
                            {province} {isSelected && districts.length > 0 && (
                              <span className="text-gray-500">Tất cả</span>
                            )}
                          </span>
                          {isSelected && districts.length > 0 && (
                            <span className="text-blue-400">→</span>
                          )}
                        </label>
                        
                        {/* Show districts if province is selected */}
                        {isSelected && districts.length > 0 && (
                          <div className="ml-6 mt-1 mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">QUẬN/HUYỆN</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSelectAllDistricts(province)}
                                  className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                  Chọn tất cả
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeselectAllDistricts(province)}
                                  className="text-xs text-gray-400 hover:text-gray-300"
                                >
                                  Bỏ chọn
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              <label className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                allDistrictsSelected 
                                  ? 'bg-blue-600/30 hover:bg-blue-600/40' 
                                  : 'hover:bg-slate-700/40'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={allDistrictsSelected}
                                  onChange={() => {
                                    if (allDistrictsSelected) {
                                      handleDeselectAllDistricts(province);
                                    } else {
                                      handleSelectAllDistricts(province);
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-500 rounded border-slate-600"
                                />
                                <span className={`text-xs ${allDistrictsSelected ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                  Tất cả
                                </span>
                              </label>
                              {districts.slice(0, 10).map((district) => (
                                <label
                                  key={district}
                                  className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                    selectedDistricts.includes(district)
                                      ? 'bg-blue-600/30 hover:bg-blue-600/40'
                                      : 'hover:bg-slate-700/40'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedDistricts.includes(district)}
                                    onChange={() => handleDistrictToggle(province, district)}
                                    className="w-4 h-4 text-blue-500 rounded border-slate-600"
                                  />
                                  <span className={`text-xs ${selectedDistricts.includes(district) ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                    {district}
                                  </span>
                                  {selectedDistricts.includes(district) && (
                                    <Check className="w-3 h-3 text-blue-400 ml-auto" />
                                  )}
                                </label>
                              ))}
                              {districts.length > 10 && (
                                <p className="text-xs text-gray-500 px-1.5">+{districts.length - 10} quận/huyện khác</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Quận/Huyện (for selected provinces) */}
              <div className="w-1/2 overflow-y-auto bg-slate-800/30">
                <div className="p-3 bg-slate-700/50 border-b border-slate-600">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase">
                    QUẬN/HUYỆN
                  </h3>
                </div>
                <div className="p-2">
                  {tempProvinces.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p className="text-sm">Vui lòng chọn Tỉnh/Thành phố</p>
                    </div>
                  ) : tempProvinces.length === 1 ? (
                    (() => {
                      const province = tempProvinces[0];
                      const districts = getDistrictsByProvince(province);
                      const selectedDistricts = tempDistricts[province] || [];
                      const allDistrictsSelected = districts.length > 0 && selectedDistricts.length === districts.length;
                      
                      return (
                        <div>
                          <div className="mb-3">
                            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              allDistrictsSelected 
                                ? 'bg-blue-600/30 hover:bg-blue-600/40' 
                                : 'hover:bg-slate-700/50'
                            }`}>
                              <input
                                type="checkbox"
                                checked={allDistrictsSelected}
                                onChange={() => {
                                  if (allDistrictsSelected) {
                                    handleDeselectAllDistricts(province);
                                  } else {
                                    handleSelectAllDistricts(province);
                                  }
                                }}
                                className="w-4 h-4 text-blue-500 rounded border-slate-600"
                              />
                              <span className={`text-sm font-semibold ${allDistrictsSelected ? 'text-white' : 'text-gray-200'}`}>
                                Tất cả
                              </span>
                              {allDistrictsSelected && (
                                <Check className="w-4 h-4 text-blue-400 ml-auto" />
                              )}
                            </label>
                          </div>
                          <div className="space-y-1">
                            {districts.map((district) => (
                              <label
                                key={district}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                  selectedDistricts.includes(district)
                                    ? 'bg-blue-600/30 hover:bg-blue-600/40'
                                    : 'hover:bg-slate-700/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDistricts.includes(district)}
                                  onChange={() => handleDistrictToggle(province, district)}
                                  className="w-4 h-4 text-blue-500 rounded border-slate-600"
                                />
                                <span className={`flex-1 text-sm ${selectedDistricts.includes(district) ? 'text-white font-semibold' : 'text-gray-200'}`}>
                                  {district}
                                </span>
                                {selectedDistricts.includes(district) && (
                                  <Check className="w-4 h-4 text-blue-400" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="space-y-4">
                      {tempProvinces.map((province) => {
                        const districts = getDistrictsByProvince(province);
                        const selectedDistricts = tempDistricts[province] || [];
                        const allDistrictsSelected = districts.length > 0 && selectedDistricts.length === districts.length;
                        
                        return (
                          <div key={province} className="border-b border-slate-700 pb-4 last:border-0">
                            <h4 className="text-sm font-medium text-white mb-2">{province}</h4>
                            <div className="mb-2">
                              <label className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                allDistrictsSelected 
                                  ? 'bg-blue-600/30 hover:bg-blue-600/40' 
                                  : 'hover:bg-slate-700/40'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={allDistrictsSelected}
                                  onChange={() => {
                                    if (allDistrictsSelected) {
                                      handleDeselectAllDistricts(province);
                                    } else {
                                      handleSelectAllDistricts(province);
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-500 rounded border-slate-600"
                                />
                                <span className={`text-xs font-semibold ${allDistrictsSelected ? 'text-white' : 'text-gray-300'}`}>
                                  Tất cả
                                </span>
                              </label>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {districts.slice(0, 8).map((district) => (
                                <label
                                  key={district}
                                  className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                    selectedDistricts.includes(district)
                                      ? 'bg-blue-600/30 hover:bg-blue-600/40'
                                      : 'hover:bg-slate-700/40'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedDistricts.includes(district)}
                                    onChange={() => handleDistrictToggle(province, district)}
                                    className="w-4 h-4 text-blue-500 rounded border-slate-600"
                                  />
                                  <span className={`text-xs ${selectedDistricts.includes(district) ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                    {district}
                                  </span>
                                  {selectedDistricts.includes(district) && (
                                    <Check className="w-3 h-3 text-blue-400 ml-auto" />
                                  )}
                                </label>
                              ))}
                              {districts.length > 8 && (
                                <p className="text-xs text-gray-500 px-1.5">+{districts.length - 8} quận/huyện khác</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default LocationSelector;
