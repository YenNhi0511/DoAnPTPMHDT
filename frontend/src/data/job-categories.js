/**
 * Dữ liệu ngành nghề Việt Nam
 * Format: 3 cấp: Nhóm nghề → Nghề → Vị trí chuyên môn
 */
export const jobCategories = [
  {
    group: 'Kinh doanh/Bán hàng',
    professions: [
      {
        name: 'Sales Xuất nhập khẩu/Logistics',
        positions: [
          'Sales Logistics',
          'Sales Xuất nhập khẩu/Logistics khác'
        ]
      },
      {
        name: 'Sales Bất động sản',
        positions: [
          'Sales bất động sản/Môi giới bất động sản',
          'Sales Bất động sản khác'
        ]
      },
      {
        name: 'Sales Xây dựng',
        positions: [
          'Kinh doanh thiết bị/vật liệu xây dựng',
          'Kinh doanh nội thất',
          'Tư vấn thiết kế xây dựng',
          'Sales Xây dựng khác'
        ]
      },
      {
        name: 'Sales Giáo dục/Khoá học',
        positions: [
          'Tư vấn tuyển sinh/khoá học',
          'Tư vấn du học/định cư',
          'Sales Giáo dục/Khoá học khác'
        ]
      },
      {
        name: 'Sales IT/Phần mềm',
        positions: [
          'Sales IT/Phần mềm',
          'Sales Cloud/SaaS',
          'Sales IT/Phần mềm khác'
        ]
      },
      {
        name: 'Sales Tài chính/Bảo hiểm',
        positions: [
          'Sales Tài chính',
          'Sales Bảo hiểm',
          'Sales Tài chính/Bảo hiểm khác'
        ]
      }
    ]
  },
  {
    group: 'Marketing/PR/Quảng cáo',
    professions: [
      {
        name: 'Digital Marketing',
        positions: [
          'SEO/SEM Specialist',
          'Social Media Marketing',
          'Content Marketing',
          'Email Marketing',
          'Digital Marketing khác'
        ]
      },
      {
        name: 'Brand Marketing',
        positions: [
          'Brand Manager',
          'Product Marketing',
          'Brand Marketing khác'
        ]
      },
      {
        name: 'PR/Quan hệ công chúng',
        positions: [
          'PR Manager',
          'PR Executive',
          'PR/Quan hệ công chúng khác'
        ]
      },
      {
        name: 'Creative/Design',
        positions: [
          'Graphic Designer',
          'Video Editor',
          'Creative Director',
          'Creative/Design khác'
        ]
      }
    ]
  },
  {
    group: 'Chăm sóc khách hàng/Vận hành',
    professions: [
      {
        name: 'Customer Service',
        positions: [
          'Customer Support',
          'Customer Success',
          'Call Center',
          'Customer Service khác'
        ]
      },
      {
        name: 'Operations',
        positions: [
          'Operations Manager',
          'Operations Executive',
          'Operations khác'
        ]
      },
      {
        name: 'Quality Assurance',
        positions: [
          'QA Tester',
          'QA Manager',
          'Quality Assurance khác'
        ]
      }
    ]
  },
  {
    group: 'Nhân sự/Hành chính/Pháp chế',
    professions: [
      {
        name: 'Nhân sự',
        positions: [
          'HR Manager',
          'HR Executive',
          'Recruiter',
          'Nhân sự khác'
        ]
      },
      {
        name: 'Hành chính',
        positions: [
          'Admin Manager',
          'Admin Executive',
          'Hành chính khác'
        ]
      },
      {
        name: 'Pháp chế',
        positions: [
          'Legal Advisor',
          'Compliance Officer',
          'Pháp chế khác'
        ]
      }
    ]
  },
  {
    group: 'Công nghệ Thông tin',
    professions: [
      {
        name: 'Lập trình viên',
        positions: [
          'Frontend Developer',
          'Backend Developer',
          'Full Stack Developer',
          'Mobile Developer',
          'Lập trình viên khác'
        ]
      },
      {
        name: 'DevOps/System Admin',
        positions: [
          'DevOps Engineer',
          'System Administrator',
          'Cloud Engineer',
          'DevOps/System Admin khác'
        ]
      },
      {
        name: 'Data/AI',
        positions: [
          'Data Engineer',
          'Data Analyst',
          'Data Scientist',
          'AI Engineer',
          'Data/AI khác'
        ]
      },
      {
        name: 'QA/Testing',
        positions: [
          'QA Engineer',
          'Test Engineer',
          'QA/Testing khác'
        ]
      },
      {
        name: 'IT Support',
        positions: [
          'IT Support',
          'Help Desk',
          'IT Support khác'
        ]
      },
      {
        name: 'Product/Project Management',
        positions: [
          'Product Manager',
          'Project Manager',
          'Scrum Master',
          'Product/Project Management khác'
        ]
      }
    ]
  },
  {
    group: 'Kế toán/Tài chính',
    professions: [
      {
        name: 'Kế toán',
        positions: [
          'Kế toán tổng hợp',
          'Kế toán thuế',
          'Kế toán tài chính',
          'Kế toán khác'
        ]
      },
      {
        name: 'Tài chính',
        positions: [
          'Financial Analyst',
          'Finance Manager',
          'Tài chính khác'
        ]
      },
      {
        name: 'Kiểm toán',
        positions: [
          'Auditor',
          'Internal Auditor',
          'Kiểm toán khác'
        ]
      }
    ]
  },
  {
    group: 'Sản xuất/Vận hành',
    professions: [
      {
        name: 'Sản xuất',
        positions: [
          'Production Manager',
          'Production Engineer',
          'Sản xuất khác'
        ]
      },
      {
        name: 'Vận hành',
        positions: [
          'Operations Manager',
          'Operations Executive',
          'Vận hành khác'
        ]
      },
      {
        name: 'Chất lượng',
        positions: [
          'Quality Manager',
          'Quality Engineer',
          'Chất lượng khác'
        ]
      }
    ]
  },
  {
    group: 'Lao động phổ thông',
    professions: [
      {
        name: 'Bảo vệ',
        positions: [
          'Bảo vệ',
          'Bảo vệ khác'
        ]
      },
      {
        name: 'Lao động phổ thông',
        positions: [
          'Công nhân',
          'Phụ xe',
          'Lao động phổ thông khác'
        ]
      }
    ]
  }
];

// Helper functions
export const getJobGroups = () => jobCategories.map(cat => cat.group);

export const getProfessionsByGroup = (groupName) => {
  const category = jobCategories.find(cat => cat.group === groupName);
  return category ? category.professions : [];
};

export const getPositionsByProfession = (groupName, professionName) => {
  const category = jobCategories.find(cat => cat.group === groupName);
  if (!category) return [];
  
  const profession = category.professions.find(p => p.name === professionName);
  return profession ? profession.positions : [];
};

export const searchCategories = (keyword) => {
  const results = {
    groups: [],
    professions: [],
    positions: []
  };
  
  const lowerKeyword = keyword.toLowerCase();
  
  jobCategories.forEach(category => {
    // Search in groups
    if (category.group.toLowerCase().includes(lowerKeyword)) {
      results.groups.push(category.group);
    }
    
    // Search in professions
    category.professions.forEach(profession => {
      if (profession.name.toLowerCase().includes(lowerKeyword)) {
        results.professions.push({
          group: category.group,
          profession: profession.name
        });
      }
      
      // Search in positions
      profession.positions.forEach(position => {
        if (position.toLowerCase().includes(lowerKeyword)) {
          results.positions.push({
            group: category.group,
            profession: profession.name,
            position: position
          });
        }
      });
    });
  });
  
  return results;
};

