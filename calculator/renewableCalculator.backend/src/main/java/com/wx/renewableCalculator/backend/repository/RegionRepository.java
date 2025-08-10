package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    
    List<Region> findByCountry(String country);
    
    @Query("SELECT r FROM Region r JOIN FETCH r.cities ORDER BY r.country, r.name")
    List<Region> findAllWithCities();
} 