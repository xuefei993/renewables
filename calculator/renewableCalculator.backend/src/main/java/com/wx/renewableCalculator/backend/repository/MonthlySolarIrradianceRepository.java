package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.MonthlySolarIrradiance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlySolarIrradianceRepository extends JpaRepository<MonthlySolarIrradiance, Long> {
    
    Optional<MonthlySolarIrradiance> findByLatitudeAndLongitudeAndMonth(Double latitude, Double longitude, Integer month);
    
    List<MonthlySolarIrradiance> findByLatitudeAndLongitudeOrderByMonth(Double latitude, Double longitude);
    
    @Query("SELECT m FROM MonthlySolarIrradiance m WHERE " +
           "ABS(m.latitude - :latitude) < 0.1 AND ABS(m.longitude - :longitude) < 0.1 " +
           "ORDER BY ABS(m.latitude - :latitude) + ABS(m.longitude - :longitude)")
    List<MonthlySolarIrradiance> findNearbyLocation(@Param("latitude") Double latitude, @Param("longitude") Double longitude);
} 