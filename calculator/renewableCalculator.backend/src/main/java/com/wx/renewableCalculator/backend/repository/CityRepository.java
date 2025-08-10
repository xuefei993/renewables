package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    List<City> findByRegionId(Long regionId);
    
    List<City> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT c FROM City c WHERE c.postcode LIKE :postcode%")
    List<City> findByPostcodeStartingWith(@Param("postcode") String postcode);
    
    @Query("SELECT c FROM City c JOIN c.region r WHERE r.country = :country")
    List<City> findByCountry(@Param("country") String country);
} 