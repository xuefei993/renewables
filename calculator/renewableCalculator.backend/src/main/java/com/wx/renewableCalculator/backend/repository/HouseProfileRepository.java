package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.HouseProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseProfileRepository extends JpaRepository<HouseProfile, Integer> {
}
