import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Edit3, Trash2, X, Image as ImageIcon } from 'lucide-react';
import API_BASE_URL from '../config/api';
import PropertyCard from '../components/PropertyCard';

const EASE = [0.16, 1, 0.3, 1];

const inputStyle = {
    width: '100%', background: '#0a0a0a', border: '1px solid #333',
    borderRadius: 8, padding: '0.75rem', color: '#fff',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box'
};

const SellerDashboard = ({ user }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '', type: 'HOUSE', price: '', area: '', beds: '', baths: '', bhk: '',
        description: '', address: '', city: ''
    });
    const [additionalDetails, setAdditionalDetails] = useState({});
    const [imageFile, setImageFile] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editPropertyId, setEditPropertyId] = useState(null);

    const fetchMyListings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/properties/my-listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'type') {
            setAdditionalDetails({});
        }
    };

    const handleAdditionalChange = (e) => {
        setAdditionalDetails({ ...additionalDetails, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setEditPropertyId(null);
        setFormData({ title: '', type: 'HOUSE', price: '', area: '', beds: '', baths: '', bhk: '', description: '', address: '', city: '' });
        setAdditionalDetails({});
        setImageFile(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (p) => {
        setIsEditMode(true);
        setEditPropertyId(p.id);
        setFormData({
            title: p.title || '', type: p.type || 'HOUSE', price: p.price || '', area: p.area || '', 
            beds: p.beds || '', baths: p.baths || '', bhk: p.bhk || '', description: p.description || '', 
            address: p.address || '', city: p.city || ''
        });
        setAdditionalDetails(p.additionalDetails || {});
        setImageFile(null); // Leave null to signify no new image
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
            const payload = { ...formData };
            if (payload.price) payload.price = parseFloat(payload.price);
            if (payload.beds === '') payload.beds = null;
            else if (payload.beds) payload.beds = parseInt(payload.beds, 10);
            if (payload.baths === '') payload.baths = null;
            else if (payload.baths) payload.baths = parseInt(payload.baths, 10);
            
            if (Object.keys(additionalDetails).length > 0) {
                payload.additionalDetails = JSON.stringify(additionalDetails);
            }
            
            data.append("property", new Blob([JSON.stringify(payload)], { type: "application/json" }));
            
            if (imageFile) {
                data.append("image", imageFile);
            }

            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/api/properties/${editPropertyId}`, data, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/properties`, data, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsAddModalOpen(false);
            fetchMyListings();
        } catch (error) {
            console.error(error);
            alert(`Error ${isEditMode ? 'editing' : 'adding'} property.`);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProperty = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.filter(p => p.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to delete property.");
        }
    };

    const renderDynamicFields = () => {
        const { type } = formData;
        if (['HOUSE', 'VILLA', 'APARTMENT'].includes(type)) {
            return (
                <>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Furnishing</label>
                            <select name="furnishing" value={additionalDetails.furnishing || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Furnished">Furnished</option>
                                <option value="Semi-Furnished">Semi-Furnished</option>
                                <option value="Unfurnished">Unfurnished</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Kitchen Type</label>
                            <select name="kitchenType" value={additionalDetails.kitchenType || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Modular">Modular</option>
                                <option value="Standard">Standard</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Parking</label>
                            <input type="text" name="parking" value={additionalDetails.parking || ''} onChange={handleAdditionalChange} style={inputStyle} placeholder="e.g. 1 Car, 2 Bikes" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Bathroom Type</label>
                            <select name="bathroomType" value={additionalDetails.bathroomType || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Western">Western</option>
                                <option value="Indian">Indian</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Balcony Area</label>
                            <input type="text" name="balcony" value={additionalDetails.balcony || ''} onChange={handleAdditionalChange} style={inputStyle} placeholder="e.g. 120 sqft" />
                        </div>
                    </div>
                </>
            );
        } else if (['LAND', 'FARMLAND', 'RESIDENTIAL_PLOT'].includes(type)) {
            return (
                <>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Zoning</label>
                            <select name="zoning" value={additionalDetails.zoning || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Agricultural">Agricultural</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Road Access Width (ft)</label>
                            <input type="number" name="roadWidth" value={additionalDetails.roadWidth || ''} onChange={handleAdditionalChange} style={inputStyle} placeholder="e.g. 30" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Water Source</label>
                            <input type="text" name="water" value={additionalDetails.water || ''} onChange={handleAdditionalChange} style={inputStyle} placeholder="e.g. Borewell" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Electricity</label>
                            <select name="electricity" value={additionalDetails.electricity || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </>
            );
        } else if (type === 'COMMERCIAL') {
            return (
                <>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Property Use</label>
                            <input type="text" name="propertyUse" value={additionalDetails.propertyUse || ''} onChange={handleAdditionalChange} style={inputStyle} placeholder="e.g. Shop, Office, Warehouse" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Washrooms</label>
                            <select name="washrooms" value={additionalDetails.washrooms || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Private">Private</option>
                                <option value="Shared">Shared</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                    </div>
                </>
            );
        } else if (type === 'PG_HOSTEL') {
            return (
                <>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Room Sharing</label>
                            <select name="roomSharing" value={additionalDetails.roomSharing || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                                <option value="More">More</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Food Included</label>
                            <select name="food" value={additionalDetails.food || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>AC / Non-AC</label>
                            <select name="ac" value={additionalDetails.ac || ''} onChange={handleAdditionalChange} style={inputStyle}>
                                <option value="">Select...</option>
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                            </select>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div style={{ background: '#000', minHeight: '100vh', paddingTop: 'var(--navbar-height)', fontFamily: 'var(--font-sans)', color: '#fff' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '1px solid #1a1a1a', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Seller Dashboard</p>
                    <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>My Listings</h1>
                </div>
                <button
                    onClick={openAddModal}
                    style={{
                        background: '#fff', color: '#000', border: 'none', borderRadius: 8,
                        padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.875rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Plus size={16} /> Add Property
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '2.5rem' }}>
                {loading ? (
                    <div style={{ color: '#555' }}>Loading listings...</div>
                ) : properties.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                        <Home size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>You haven't listed any properties yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {properties.map(p => (
                            <div key={p.id} style={{ position: 'relative' }}>
                                <PropertyCard property={p} user={user} />
                                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => openEditModal(p)}
                                        style={{
                                            background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.3)',
                                            color: '#fff', borderRadius: '50%', width: 32, height: 32,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteProperty(p.id)}
                                        style={{
                                            background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,0,0,0.3)',
                                            color: '#ff4d4d', borderRadius: '50%', width: 32, height: 32,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {/* Status overlay for Seller */}
                                <div style={{
                                    position: 'absolute', top: 10, left: 10, zIndex: 10,
                                    background: p.status === 'AVAILABLE' ? 'rgba(0,0,0,0.8)' : 'rgba(255,180,0,0.9)',
                                    color: p.status === 'AVAILABLE' ? '#fff' : '#000',
                                    padding: '4px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase'
                                }}>
                                    {p.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                x: '-50%', y: '-50%',
                                background: '#000', border: '1px solid #222', borderRadius: 16,
                                width: '90%', maxWidth: 600, maxHeight: '90vh',
                                zIndex: 1001, display: 'flex', flexDirection: 'column', overflow: 'hidden'
                            }}
                        >
                            <div style={{ overflowY: 'auto', padding: '2rem', flex: 1, overscrollBehavior: 'contain', scrollBehavior: 'smooth' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{isEditMode ? 'Edit Property' : 'Add New Property'}</h2>
                                    <button onClick={() => setIsAddModalOpen(false)} style={{ background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Title *</label>
                                        <input required type="text" name="title" value={formData.title} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Modern Apartment in Downtown" />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Type *</label>
                                            <select required name="type" value={formData.type} onChange={handleInputChange} style={inputStyle}>
                                                <option value="HOUSE">House</option>
                                                <option value="APARTMENT">Apartment</option>
                                                <option value="VILLA">Villa</option>
                                                <option value="LAND">Land</option>
                                                <option value="FARMLAND">Farmland</option>
                                                <option value="COMMERCIAL">Commercial</option>
                                                <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                                                <option value="PG_HOSTEL">PG/Hostel</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Price (₹) *</label>
                                            <input required type="number" name="price" value={formData.price} onChange={handleInputChange} style={inputStyle} placeholder="e.g. 5000000" />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>City *</label>
                                            <input required type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Mumbai" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Area (sqft) *</label>
                                            <input required type="text" name="area" value={formData.area} onChange={handleInputChange} style={inputStyle} placeholder="e.g. 1500" />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Beds *</label>
                                            <input required type="number" name="beds" value={formData.beds} onChange={handleInputChange} style={inputStyle} placeholder="2" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Baths *</label>
                                            <input required type="number" name="baths" value={formData.baths} onChange={handleInputChange} style={inputStyle} placeholder="2" />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Address *</label>
                                        <input required type="text" name="address" value={formData.address} onChange={handleInputChange} style={inputStyle} placeholder="Full street address" />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Description *</label>
                                        <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe the property..."></textarea>
                                    </div>

                                    {renderDynamicFields()}

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Property Image *</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px dashed #333', borderRadius: 8, padding: '0.75rem 1rem', cursor: 'pointer', flex: 1, justifyContent: 'center', transition: 'border 0.2s' }}>
                                                <ImageIcon size={16} color="#888" />
                                                <span style={{ color: '#888', fontSize: '0.875rem' }}>{imageFile ? imageFile.name : (isEditMode ? 'Leave empty to keep existing image' : 'Select Image...')}</span>
                                                <input required={!isEditMode} type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            background: '#fff', color: '#000', border: 'none', borderRadius: 8,
                                            padding: '1rem', fontWeight: 700, fontSize: '1rem', marginTop: '1rem',
                                            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
                                        }}
                                    >
                                        {submitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Property')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerDashboard;
