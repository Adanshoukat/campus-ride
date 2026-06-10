// --- OOP CONCEPTS (Classes & Inheritance) ---

// Base Class (Parent Class)
class User {
    constructor(id, name, contact) {
        this.id = id;
        this.name = name;
        this.contact = contact;
    }
}

// Student Class inheriting User (Inheritance)
class Student extends User {
    constructor(id, name, rollNo, routeId, contact, feeStatus = 'unpaid', feeAmount = 5000) {
        super(id, name, contact); // Parent class ka constructor call kiya
        this.rollNo = rollNo;
        this.routeId = routeId;
        this.feeStatus = feeStatus;
        this.feeAmount = feeAmount;
    }
}

// Driver Class inheriting User (Inheritance)
class Driver extends User {
    constructor(id, name, license, assignedBusId) {
        super(id, null, null); // Base class features use kiye
        this.name = name; // Driver details
        this.license = license;
        this.assignedBusId = assignedBusId;
    }
}

// Bus Class (Encapsulation)
class Bus {
    constructor(id, busNumber, capacity, assignedRouteId) {
        this.id = id;
        this.busNumber = busNumber;
        this.capacity = capacity;
        this.assignedRouteId = assignedRouteId;
    }
}


// --- State Management (LocalStorage) ---

const initData = () => {
    if (!localStorage.getItem('students')) localStorage.setItem('students', JSON.stringify([]));
    if (!localStorage.getItem('buses')) localStorage.setItem('buses', JSON.stringify([]));
    if (!localStorage.getItem('drivers')) localStorage.setItem('drivers', JSON.stringify([]));
    if (!localStorage.getItem('routes')) localStorage.setItem('routes', JSON.stringify([]));
    if (!localStorage.getItem('schedules')) localStorage.setItem('schedules', JSON.stringify([]));
};

const getData = (key) => JSON.parse(localStorage.getItem(key));
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- UI & Navigation ---

const navigateTo = (targetId) => {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.target === targetId) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(targetId).classList.add('active');

    document.getElementById('sidebar').classList.remove('open');

    if (targetId === 'dashboard') updateDashboard();
    if (targetId === 'fees') renderFees();
};

document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(e.currentTarget.dataset.target);
    });
});

document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-check-circle" style="color:var(--success)"></i>' : '<i class="fa-solid fa-exclamation-circle" style="color:var(--danger)"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// --- Form Submissions & CRUD Logic Using OOP Objects ---

// 1. Routes
const renderRoutesList = () => {
    const routes = getData('routes');
    const container = document.getElementById('route-cards-container');
    container.innerHTML = '';

    if (routes.length === 0) {
        container.innerHTML = '<p class="text-muted">No routes defined yet.</p>';
        return;
    }

    routes.forEach(route => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-title"><i class="fa-solid fa-route"></i> ${route.routeName}</div>
            </div>
            <div class="item-detail">
                <span>Stops:</span>
                <span style="text-align: right;">${route.stops}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteItem('routes', '${route.id}', renderRoutesList)"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(card);
    });
    updateSelectOptions();
};

document.getElementById('route-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('route-name').value;
    const stops = document.getElementById('route-stops').value;

    const routes = getData('routes');
    routes.push({ id: generateId(), routeName: name, stops });
    saveData('routes', routes);

    showToast('Route added successfully!');
    e.target.reset();
    renderRoutesList();
});


// 2. Buses (OOP Object Implementation)
const renderBusesList = () => {
    const buses = getData('buses');
    const routes = getData('routes');
    const container = document.getElementById('bus-cards-container');
    container.innerHTML = '';

    if (buses.length === 0) {
        container.innerHTML = '<p class="text-muted">No buses added yet.</p>';
        return;
    }

    buses.forEach(busData => {
        // Class Instance (Object) banana
        const bus = new Bus(busData.id, busData.busNumber, busData.capacity, busData.assignedRouteId);
        const assignedRoute = routes.find(r => r.id === bus.assignedRouteId);
        const routeName = assignedRoute ? assignedRoute.routeName : 'Unassigned';

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-title"><i class="fa-solid fa-van-shuttle"></i> ${bus.busNumber}</div>
            </div>
            <div class="item-detail">
                <span>Capacity:</span>
                <span>${bus.capacity} Seats</span>
            </div>
            <div class="item-detail">
                <span>Route:</span>
                <span>${routeName}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteItem('buses', '${bus.id}', renderBusesList)"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(card);
    });
    updateSelectOptions();
};

document.getElementById('bus-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const busNumber = document.getElementById('bus-number').value;
    const capacity = document.getElementById('bus-capacity').value;
    const routeId = document.getElementById('bus-route').value;

    const buses = getData('buses');
    // Creating object using Class
    const newBus = new Bus(generateId(), busNumber, capacity, routeId);
    buses.push(newBus);
    saveData('buses', buses);

    showToast('Bus added successfully!');
    e.target.reset();
    renderBusesList();
});


// 3. Drivers (OOP Inheritance Implementation)
const renderDriversList = () => {
    const drivers = getData('drivers');
    const buses = getData('buses');
    const tbody = document.getElementById('driver-table-body');
    tbody.innerHTML = '';

    if(drivers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No drivers found.</td></tr>';
        return;
    }

    drivers.forEach(driverData => {
        const driver = new Driver(driverData.id, driverData.name, driverData.license, driverData.assignedBusId);
        const assignedBus = buses.find(b => b.id === driver.assignedBusId);
        const busNum = assignedBus ? assignedBus.busNumber : 'Unassigned';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${driver.name}</td>
            <td>${driver.license}</td>
            <td>${busNum}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('drivers', '${driver.id}', renderDriversList)"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

document.getElementById('driver-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('driver-name').value;
    const license = document.getElementById('driver-license').value;
    const busId = document.getElementById('driver-bus').value;

    const drivers = getData('drivers');
    const newDriver = new Driver(generateId(), name, license, busId);
    drivers.push(newDriver);
    saveData('drivers', drivers);

    showToast('Driver added successfully!');
    e.target.reset();
    renderDriversList();
});

// 4. Students (OOP Inheritance Implementation)
const renderStudentsList = (searchTerm = '') => {
    const students = getData('students');
    const routes = getData('routes');
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No students found.</td></tr>';
        return;
    }

    filtered.forEach(studentData => {
        const student = new Student(studentData.id, studentData.name, studentData.rollNo, studentData.routeId, studentData.contact, studentData.feeStatus, studentData.feeAmount);
        const route = routes.find(r => r.id === student.routeId);
        const routeName = route ? route.routeName : 'N/A';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${routeName}</td>
            <td>${student.contact}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('students', '${student.id}', renderStudentsList)"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const rollNo = document.getElementById('student-roll').value;
    const routeId = document.getElementById('student-route').value;
    const contact = document.getElementById('student-contact').value;

    const students = getData('students');
    const newStudent = new Student(generateId(), name, rollNo, routeId, contact);
    students.push(newStudent);
    saveData('students', students);

    showToast('Student registered successfully!');
    e.target.reset();
    renderStudentsList();
    renderFees(); 
    updateDashboard();
});

document.getElementById('search-student').addEventListener('input', (e) => {
    renderStudentsList(e.target.value);
});


// 5. Schedule
const renderScheduleList = (filterRoute = 'all') => {
    const schedules = getData('schedules');
    const routes = getData('routes');
    const tbody = document.getElementById('schedule-table-body');
    tbody.innerHTML = '';

    let filtered = schedules;
    if(filterRoute !== 'all') {
        filtered = schedules.filter(s => s.routeId === filterRoute);
    }

    filtered.sort((a, b) => a.depTime.localeCompare(b.depTime));

    if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No schedules found.</td></tr>';
        return;
    }

    filtered.forEach(sched => {
        const route = routes.find(r => r.id === sched.routeId);
        const routeName = route ? route.routeName : 'Unknown';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${routeName}</td>
            <td>${sched.depTime}</td>
            <td>${sched.arrTime}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('schedules', '${sched.id}', renderScheduleList)"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

document.getElementById('schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const routeId = document.getElementById('schedule-route').value;
    const depTime = document.getElementById('schedule-dep').value;
    const arrTime = document.getElementById('schedule-arr').value;

    const schedules = getData('schedules');
    schedules.push({ id: generateId(), routeId, depTime, arrTime });
    saveData('schedules', schedules);

    showToast('Schedule added successfully!');
    e.target.reset();
    renderScheduleList();
});

document.getElementById('filter-schedule-route').addEventListener('change', (e) => {
    renderScheduleList(e.target.value);
});

// 6. Fees
const renderFees = () => {
    const students = getData('students');
    const routes = getData('routes');
    const tbody = document.getElementById('fee-table-body');
    const searchTerm = document.getElementById('search-fee').value.toLowerCase();
    const filterStatus = document.getElementById('filter-fee-status').value;
    
    tbody.innerHTML = '';

    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.rollNo.toLowerCase().includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || s.feeStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No records found.</td></tr>';
        return;
    }

    filtered.forEach(student => {
        const route = routes.find(r => r.id === student.routeId);
        const routeName = route ? route.routeName : 'N/A';
        const isPaid = student.feeStatus === 'paid';
        const badgeClass = isPaid ? 'badge-paid' : 'badge-unpaid';
        const badgeText = isPaid ? 'Paid' : 'Unpaid';
        const actionBtn = isPaid 
            ? `<button class="btn btn-sm btn-outline" disabled>Collected</button>`
            : `<button class="btn btn-sm btn-success" onclick="markFeePaid('${student.id}')">Mark Paid</button>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${routeName}</td>
            <td>$${student.feeAmount}</td>
            <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
};

const markFeePaid = (studentId) => {
    const students = getData('students');
    const index = students.findIndex(s => s.id === studentId);
    if(index !== -1) {
        students[index].feeStatus = 'paid';
        saveData('students', students);
        showToast('Fee marked as paid');
        renderFees();
        updateDashboard();
    }
};

document.getElementById('search-fee').addEventListener('input', renderFees);
document.getElementById('filter-fee-status').addEventListener('change', renderFees);


// --- Generic Utilities ---

window.deleteItem = (key, id, renderCallback) => {
    if(confirm('Are you sure you want to delete this item?')) {
        let data = getData(key);
        data = data.filter(item => item.id !== id);
        saveData(key, data);
        showToast('Item deleted.');
        renderCallback();
        updateDashboard();
    }
};

const updateSelectOptions = () => {
    const routes = getData('routes');
    const buses = getData('buses');

    const routeSelects = [
        document.getElementById('student-route'),
        document.getElementById('bus-route'),
        document.getElementById('schedule-route')
    ];
    
    routeSelects.forEach(select => {
        if(select) {
            const firstOpt = select.options[0];
            select.innerHTML = '';
            if(firstOpt) select.appendChild(firstOpt);
            
            routes.forEach(route => {
                const opt = document.createElement('option');
                opt.value = route.id;
                opt.textContent = route.routeName;
                select.appendChild(opt);
            });
        }
    });

    const filterSchedRoute = document.getElementById('filter-schedule-route');
    if(filterSchedRoute) {
        filterSchedRoute.innerHTML = '<option value="all">All Routes</option>';
        routes.forEach(route => {
            const opt = document.createElement('option');
            opt.value = route.id;
            opt.textContent = route.routeName;
            filterSchedRoute.appendChild(opt);
        });
    }

    const driverBusSelect = document.getElementById('driver-bus');
    if(driverBusSelect) {
        driverBusSelect.innerHTML = '<option value="">Unassigned</option>';
        buses.forEach(bus => {
            const opt = document.createElement('option');
            opt.value = bus.id;
            opt.textContent = bus.busNumber;
            driverBusSelect.appendChild(opt);
        });
    }
};

// --- Dashboard Logic ---

const updateDashboard = () => {
    const students = getData('students');
    const buses = getData('buses');
    const drivers = getData('drivers');
    const routes = getData('routes');

    document.getElementById('stat-total-students').textContent = students.length;
    document.getElementById('stat-total-buses').textContent = buses.length;
    document.getElementById('stat-total-drivers').textContent = drivers.length;
    document.getElementById('stat-total-routes').textContent = routes.length;

    const paidStudents = students.filter(s => s.feeStatus === 'paid').length;
    const unpaidStudents = students.length - paidStudents;
    
    document.getElementById('stat-paid-students').textContent = paidStudents;
    document.getElementById('stat-unpaid-students').textContent = unpaidStudents;

    const percentPaid = students.length > 0 ? (paidStudents / students.length) * 100 : 0;
    const progressBar = document.getElementById('fee-progress-bar');
    if(progressBar) progressBar.style.width = `${percentPaid}%`;
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initData();
    updateSelectOptions();
    
    renderRoutesList();
    renderBusesList();
    renderDriversList();
    renderStudentsList();
    renderScheduleList();
    renderFees();
    updateDashboard();
});